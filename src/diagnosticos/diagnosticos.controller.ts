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
} from '@nestjs/common';
import { DiagnosticosService } from './diagnosticos.service';
import { CreateDiagnosticoDto } from './dto/create-diagnostico.dto';
import { UpdateDiagnosticoDto } from './dto/update-diagnostico.dto';
import { PdfService } from 'src/pdf/pdf.service';
import { Response } from 'express';

@Controller('diagnostic')
export class DiagnosticosController {
  constructor(
    private readonly diagnosticosService: DiagnosticosService,
    private pdfService: PdfService,
  ) {}

  @Post('/create-diagnostic')
  createDiagnostico(@Body() createDiagnosticoDto: CreateDiagnosticoDto) {
    return this.diagnosticosService.createDiagnostic(createDiagnosticoDto);
  }

  @Get('/diagnostics')
  findAllDiagnosticos(@Query('offset') offset: string) {
    return this.diagnosticosService.findAllDiagnostics(offset);
  }

  @Get('/diagnostics/id/:id')
  findDiagnosticById(@Param('id') id: string) {
    return this.diagnosticosService.findDiagnosticById(id);
  }

  @Get('/diagnostics/vehicle/:placa')
  findDiagnosticsByVehicle(
    @Query('offset') offset: string,
    @Param('placa') placa: string,
  ) {
    return this.diagnosticosService.findDiagnosticByVehicle(offset, placa);
  }

  @Patch('/diagnostics/id/:id/update')
  update(
    @Param('id') id: string,
    @Body() updateDiagnosticoDto: UpdateDiagnosticoDto,
  ) {
    //return this.diagnosticosService.update(+id, updateDiagnosticoDto);
  }

  @Delete('/diagnostics/id/:id/delete')
  deleteDiagnostic(@Param('id') id: string) {
    return this.diagnosticosService.deleteDiagnostic(id);
  }

  @Get('/diagnostics/id/:id/print')
  async printDiagnostic(@Param('id') id: string, @Res() res: Response) {
    const diagnosticData = await this.diagnosticosService.printDiagnostic(id);

    if (diagnosticData instanceof Error) {
      throw new Error(diagnosticData.message);
    }

    const data = diagnosticData.data;
    const docType = diagnosticData.docType;

    const pdf = await this.pdfService.generatePDF(data, docType);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Diagnóstico Nº${diagnosticData.data.num_diagnostico}, ${diagnosticData.data.vehiculo.placa}, ${diagnosticData.data.vehiculo.cliente.datos.cedula_id_detalles}.pdf"`,
    );

    pdf.pipe(res);
    pdf.end();
  }
}
