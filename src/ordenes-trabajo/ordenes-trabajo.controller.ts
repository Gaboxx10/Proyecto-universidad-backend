import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Query,
  Res,
  UseGuards,
} from '@nestjs/common';
import { OrdenesTrabajoService } from './ordenes-trabajo.service';
import { CreateOrdenesTrabajoDto } from './dto/create-ordenes-trabajo.dto';
//import { UpdateOrdenesTrabajoDto } from './dto/update-ordenes-trabajo.dto';
import { Response } from 'express';
import { PdfService } from 'src/pdf/pdf.service';

import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { RolesGuard } from 'src/shared/guards/roles-auth.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Rol } from 'src/constants/constants';

@Controller('ordenes-trabajo')
@UseGuards(JwtAuthGuard, RolesGuard)
export class OrdenesTrabajoController {
  constructor(
    private readonly ordenesTrabajoService: OrdenesTrabajoService,
    private pdfService: PdfService,
  ) {}

  @Post('/create-orden')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  create(@Body() createOrdenesTrabajoDto: CreateOrdenesTrabajoDto) {
    return this.ordenesTrabajoService.createOrden(createOrdenesTrabajoDto);
  }

  @Get('/ordenes')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findAllOrdenes(@Query('offset') offset: string) {
    return this.ordenesTrabajoService.findAllOrdenes(offset);
  }

  @Get('/ordenes/id/:id')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findOrdenById(@Param('id') id: string) {
    return this.ordenesTrabajoService.findOrdenById(id);
  }

  @Get('/ordenes/search/')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  searchOrden(@Query('search') search: string, @Query("offset") offset: string) {
    return this.ordenesTrabajoService.searchOrden(search, offset);
  }

  @Delete('/ordenes/id/:id/delete')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  deleteOrden(@Param('id') id: string) {
    return this.ordenesTrabajoService.deleteOrden(id);
  }

  @Get('/ordenes/id/:id/print')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  async printOrdenTrabajo(@Param('id') id: string, @Res() res: Response) {
    const orden = await this.ordenesTrabajoService.printOrden(id);

    if (orden instanceof Error) {
      return res.status(404).json({ message: orden.message, statusCode: 404 }); 
    }

    const ordenTrabajo = orden.data;
    const docType = orden.docType;

    const pdf = await this.pdfService.generatePDF(ordenTrabajo, docType);

    const date =  new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Orden Nº${ordenTrabajo.num_orden}, ${ordenTrabajo.vehiculo.placa}, ${ordenTrabajo.vehiculo.cliente.datos.cedula_id_detalles}, ${date}.pdf"`,
    );

    pdf.pipe(res);
    pdf.end();
  }
}
