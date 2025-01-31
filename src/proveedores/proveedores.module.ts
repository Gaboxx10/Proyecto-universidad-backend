import { Module } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { ProveedoresController } from './proveedores.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { Errors } from 'src/shared/errors.service';

@Module({
  controllers: [ProveedoresController],
  providers: [ProveedoresService, PrismaService, Errors],
})
export class ProveedoresModule {}
