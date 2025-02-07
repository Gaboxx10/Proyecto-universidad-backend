import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { DiagnosticosService } from './diagnosticos.service';
import { CreateDiagnosticoDto } from './dto/create-diagnostico.dto';
import { UpdateDiagnosticoDto } from './dto/update-diagnostico.dto';
import { PdfService } from 'src/pdf/pdf.service';
import { Response } from 'express';

import { Roles } from 'src/shared/decorators/roles.decorator';
import { Rol } from 'src/constants/constants';
import { RolesGuard } from 'src/shared/guards/roles-auth.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';


@Controller('diagnostic')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DiagnosticosController {
  constructor(
    private readonly diagnosticosService: DiagnosticosService,
    private pdfService: PdfService,
  ) {}

  
  @Post('/create-diagnostic')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  createDiagnostico(@Body() createDiagnosticoDto: CreateDiagnosticoDto) {
    return this.diagnosticosService.createDiagnostic(createDiagnosticoDto);
  }

  @Get('/diagnostics')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findAllDiagnosticos(@Query('offset') offset: string) {
    return this.diagnosticosService.findAllDiagnostics(offset);
  }

  @Get('/diagnostics/id/:id')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findDiagnosticById(@Param('id') id: string) {
    return this.diagnosticosService.findDiagnosticById(id);
  }

  @Get('/diagnostics/search/')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  searchDiagnostic(@Query('search') search: string, @Query("offset") offset: string) {
    return this.diagnosticosService.searchDiagnostic(search, offset);
  }

  @Patch('/diagnostics/id/:id/update')
  update(
    @Param('id') id: string,
    @Body() updateDiagnosticoDto: UpdateDiagnosticoDto,
  ) {
    //return this.diagnosticosService.update(+id, updateDiagnosticoDto);
  }

  @Delete('/diagnostics/id/:id/delete')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  deleteDiagnostic(@Param('id') id: string) {
    return this.diagnosticosService.deleteDiagnostic(id);
  }

  @Get('/diagnostics/id/:id/print')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  async printDiagnostic(@Param('id') id: string, @Res() res: Response) {
    const diagnosticData = await this.diagnosticosService.printDiagnostic(id);

    if (diagnosticData instanceof Error) {
      return res.status(404).json({ message: diagnosticData.message, statusCode: 404 }); 
    }

    const data = diagnosticData.data;
    const docType = diagnosticData.docType;

    const pdf = await this.pdfService.generatePDF(data, docType);

    const date =  new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Diagnóstico Nº${diagnosticData.data.num_diagnostico}, ${diagnosticData.data.vehiculo.placa}, ${diagnosticData.data.vehiculo.cliente.datos.cedula_id_detalles}, ${date}.pdf"`,
    );

    pdf.pipe(res);
    pdf.end();
  }
}
