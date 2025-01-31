import { Module } from '@nestjs/common';
import { OrdenesTrabajoService } from './ordenes-trabajo.service';
import { OrdenesTrabajoController } from './ordenes-trabajo.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from 'src/client/client.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Errors } from 'src/shared/errors.service';

@Module({
  controllers: [OrdenesTrabajoController],
  providers: [OrdenesTrabajoService, PrismaService, Errors, ClientService, VehicleService],
})
export class OrdenesTrabajoModule {}
