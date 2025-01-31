import { Module } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { VehicleController } from './vehicle.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from 'src/client/client.service';
import { Errors } from 'src/shared/errors.service';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, PrismaService, ClientService, Errors],
  exports: [VehicleService],
})
export class VehicleModule {}
