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
import { OrdenesTrabajoService } from './ordenes-trabajo.service';
import { CreateOrdenesTrabajoDto } from './dto/create-ordenes-trabajo.dto';
import { UpdateOrdenesTrabajoDto } from './dto/update-ordenes-trabajo.dto';
import { Response } from 'express';
import { PdfService } from 'src/pdf/pdf.service';

@Controller('ordenes-trabajo')
export class OrdenesTrabajoController {
  constructor(
    private readonly ordenesTrabajoService: OrdenesTrabajoService,
    private pdfService: PdfService,
  ) {}

  @Post('/create-orden')
  create(@Body() createOrdenesTrabajoDto: CreateOrdenesTrabajoDto) {
    return this.ordenesTrabajoService.createOrden(createOrdenesTrabajoDto);
  }

  @Get('/ordenes')
  findAllOrdenes(@Query('offset') offset: string) {
    return this.ordenesTrabajoService.findAllOrdenes(offset);
  }

  @Get('/ordenes/id/:id')
  findOrdenById(@Param('id') id: string) {
    return this.ordenesTrabajoService.findOrdenById(id);
  }

  @Get('/ordenes/search/')
  searchOrden(@Query('search') search: string, @Query("offset") offset: string) {
    return this.ordenesTrabajoService.searchOrden(search, offset);
  }

  @Delete('/ordenes/id/:id/delete')
  deleteOrden(@Param('id') id: string) {
    return this.ordenesTrabajoService.deleteOrden(id);
  }

  @Get('/ordenes/id/:id/print')
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
