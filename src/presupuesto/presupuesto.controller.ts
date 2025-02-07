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
import { PresupuestoService } from './presupuesto.service';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';
import { Response } from 'express';
import { PdfService } from 'src/pdf/pdf.service';

import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles-auth.guard';
import { Rol } from 'src/constants/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';

@Controller('presupuesto')
@UseGuards(JwtAuthGuard, RolesGuard)
export class PresupuestoController {
  constructor(
    private readonly presupuestoService: PresupuestoService,
    private pdfService: PdfService,
  ) {}

  @Post('/create-presupuesto')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  createPresupuesto(@Body() createPresupuestoDto: CreatePresupuestoDto) {
    return this.presupuestoService.createPresupuesto(createPresupuestoDto);
  }

  @Get('/presupuestos')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findAllPresupuestos(@Query('offset') offset: string) {
    return this.presupuestoService.findAllPresupuestos(offset);
  }

  @Get('/presupuestos/id/:id')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findPresupuestoById(@Param('id') id: string) {
    return this.presupuestoService.findPresupuestoById(id);
  }

  @Get('/presupuestos/search/')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  searchPresupuestos(@Query("search") search: string, @Query("offset") offset: string) {
    return this.presupuestoService.searchPresupuestos(search, offset);
  }

  @Patch('/presupuestos/id/:id/update')
  updatePresupuesto(
    @Param('id') id: string,
    @Body() updatePresupuestoDto: UpdatePresupuestoDto,
  ) {
    //return this.presupuestoService.update(+id, updatePresupuestoDto);
  }

  @Delete('/presupuestos/id/:id/delete')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  deletePresupuesto(@Param('id') id: string) {
    return this.presupuestoService.deletePresupuesto(id);
  }

  @Get('/presupuestos/id/:id/print')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  async printPresupuesto(@Param('id') id: string, @Res() res: Response) {
    const presupuesto = await this.presupuestoService.printPresupuesto(id);

    if (presupuesto instanceof Error) {
      return res
        .status(404)
        .json({ message: presupuesto.message, statusCode: 404 });
    }

    const presupuestoData = presupuesto.data;
    const docType = presupuesto.docType;

    const pdf = await this.pdfService.generatePDF(presupuestoData, docType);

    const date =  new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Presupuesto Nº${presupuestoData.num_presupuesto}, ${presupuestoData.vehiculo.placa}, ${presupuestoData.vehiculo.cliente.datos.cedula_id_detalles}, ${date}.pdf"`,
    );

    pdf.pipe(res);
    pdf.end();
  }
}
