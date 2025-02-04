import { Module } from '@nestjs/common';
import { FacturaService } from './factura.service';
import { FacturaController } from './factura.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from 'src/client/client.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Errors } from 'src/shared/errors.service';
import { PdfService } from 'src/pdf/pdf.service';
import { TemplateService } from 'src/pdf/templates/templateService';

@Module({
  controllers: [FacturaController],
  providers: [FacturaService, PrismaService, ClientService, VehicleService, Errors, PdfService, TemplateService, Errors],
})
export class FacturaModule {}
