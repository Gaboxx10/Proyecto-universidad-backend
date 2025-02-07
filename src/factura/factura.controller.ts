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
  UseGuards,
} from '@nestjs/common';
import { FacturaService } from './factura.service';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { PdfService } from 'src/pdf/pdf.service';
import { Response } from 'express';

import { Rol } from 'src/constants/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles-auth.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

export interface Pay {
  confirm: boolean;
}

@Controller('factura')
@UseGuards(JwtAuthGuard, RolesGuard)
export class FacturaController {
  constructor(
    private readonly facturaService: FacturaService,
    private pdfService: PdfService,
  ) {}

  @Post('/create-factura')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  create(@Body() createFacturaDto: CreateFacturaDto) {
    return this.facturaService.createFactura(createFacturaDto);
  }

  @Get('/facturas')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findAllFacturas(@Query('offset') offset: string) {
    return this.facturaService.findAllFacturas(offset);
  }

  @Get('/facturas/id/:id')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findFacturaById(@Param('id') id: string) {
    return this.facturaService.findFacturaById(id);
  }

  @Get('/facturas/search/')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  searchFactura(
    @Query('search') search: string,
    @Query('offset') offset: string,
  ) {
    return this.facturaService.searchFactura(search, offset);
  }

  @Patch('/facturas/id/:id/confirm-pay')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  update(@Param('id') id: string, @Body() data: Pay) {
    return this.facturaService.confirmPay(id, data);
  }

  @Delete('/facturas/id/:id/delete')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  remove(@Param('id') id: string) {
    return this.facturaService.deleteFactura(id);
  }

  @Get('/facturas/id/:id/print')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  async printFactura(@Param('id') id: string, @Res() res: Response) {
    const factura = await this.facturaService.printFactura(id);

    if (factura instanceof Error) {
      return res
        .status(404)
        .json({ message: factura.message, statusCode: 404 });
    }

    const data = factura.data;
    const docType = factura.docType;

    const pdf = await this.pdfService.generatePDF(data, docType);

    const date = new Date().toLocaleDateString('es-ES', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    });

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Factura Nº${factura.data.num_factura}, ${factura.data.Vehiculo.placa}, ${factura.data.cliente.datos.cedula_id_detalles}, ${date}.pdf"`,
    );

    pdf.pipe(res);
    pdf.end();
  }
}
