import { Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { Errors } from 'src/shared/errors.service';

@Module({
  imports: [],
  controllers: [ClientController],
  providers: [ClientService, PrismaService, Errors],
  exports: [ClientService],
})
export class ClientModule {}
