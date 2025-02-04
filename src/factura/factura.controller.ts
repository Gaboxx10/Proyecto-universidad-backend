import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Res,
  Query,
} from '@nestjs/common';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { PdfService } from 'src/pdf/pdf.service';
import { Response } from 'express';

export interface Pay {
  confirm: boolean;
}

@Controller('factura')
export class FacturaController {
  constructor(
    private readonly facturaService: FacturaService,
    private pdfService: PdfService,
  ) {}

  @Post('/create-factura')
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturaService.createFactura(createFacturaDto);
  }

  @Get('/facturas')
  findAllFacturas(@Query('offset') offset: string) {
    return this.facturaService.findAllFacturas(offset);
  }

  @Get('/facturas/id/:id')
  findFacturaById(@Param('id') id: string) {
    return this.facturaService.findFacturaById(id);
  }

  @Patch('/facturas/id/:id/confirm-pay')
  update(@Param('id') id: string, @Body() data: Pay) {
    return this.facturaService.confirmPay(id, data);
  }

  @Delete('/facturas/id/:id/delete')
  remove(@Param('id') id: string) {
    return this.facturaService.deleteFactura(id);
  }

  @Get('/facturas/id/:id/print')
  async printFactura(@Param('id') id: string, @Res() res: Response) {
    console.log('id', id);
    const factura = await this.facturaService.printFactura(id);

    if (factura instanceof Error) {
      return res.status(404).json({
        message: "Error al exportar factura",
      });
    }

    const data = factura.data;
    const docType = factura.docType;

    const pdf = await this.pdfService.generatePDF(data, docType);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Factura Nº${factura.data.num_factura}, ${factura.data.Vehiculo.placa}, ${factura.data.cliente.datos.cedula_id_detalles}.pdf"`,
    );

    pdf.pipe(res);
    pdf.end();
  }
}
