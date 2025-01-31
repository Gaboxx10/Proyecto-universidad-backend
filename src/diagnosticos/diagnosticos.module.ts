import { Module } from '@nestjs/common';
import { DiagnosticosService } from './diagnosticos.service';
import { DiagnosticosController } from './diagnosticos.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { ClientService } from 'src/client/client.service';
import { Errors } from 'src/shared/errors.service';

@Module({
  controllers: [DiagnosticosController],
  providers: [DiagnosticosService, PrismaService, VehicleService, ClientService, Errors],
})
export class DiagnosticosModule {}
