import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PdfController } from './pdf.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { TemplateService } from './templates/templateService';

@Module({
  controllers: [PdfController],
  providers: [PdfService, PrismaService, TemplateService],
})
export class PdfModule {}

