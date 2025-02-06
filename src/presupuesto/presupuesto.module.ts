import { Module } from '@nestjs/common';
import { PresupuestoService } from './presupuesto.service';
import { PresupuestoController } from './presupuesto.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { Errors } from 'src/shared/errors.service';
import { ClientService } from 'src/client/client.service';
import { PdfService } from 'src/pdf/pdf.service';
import { TemplateService } from 'src/pdf/templates/templateService';

@Module({
  controllers: [PresupuestoController],
  providers: [PresupuestoService, VehicleService, PrismaService, Errors, ClientService, PdfService, TemplateService],
})
export class PresupuestoModule {}
