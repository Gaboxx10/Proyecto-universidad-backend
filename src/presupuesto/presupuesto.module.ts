import { Module } from '@nestjs/common';
import { PresupuestoService } from './presupuesto.service';
import { PresupuestoController } from './presupuesto.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { Errors } from 'src/shared/errors.service';
import { ClientService } from 'src/client/client.service';

@Module({
  controllers: [PresupuestoController],
  providers: [PresupuestoService, VehicleService, PrismaService, Errors, ClientService],
})
export class PresupuestoModule {}
