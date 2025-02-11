import { Module } from '@nestjs/common';
import { OrdenesTrabajoService } from './ordenes-trabajo.service';
import { OrdenesTrabajoController } from './ordenes-trabajo.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from 'src/client/client.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Errors } from 'src/shared/errors.service';
import { PdfService } from 'src/pdf/pdf.service';
import { TemplateService } from 'src/pdf/templates/templateService';

@Module({
  controllers: [OrdenesTrabajoController],
  providers: [OrdenesTrabajoService, PrismaService, Errors, ClientService, VehicleService, PdfService, TemplateService],
})
export class OrdenesTrabajoModule {}
