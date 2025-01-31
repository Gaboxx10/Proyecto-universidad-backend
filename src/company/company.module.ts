import { Module } from '@nestjs/common';
import { CompanyService } from './company.service';
import { CompanyController } from './company.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { Errors } from 'src/shared/errors.service';

@Module({
  controllers: [CompanyController],
  providers: [CompanyService, PrismaService, Errors],
})
export class CompanyModule {}
