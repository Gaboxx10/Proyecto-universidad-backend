import { Module } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { TemplateService } from './templates/templateService';

@Module({
  controllers: [],
  providers: [PdfService, PrismaService, TemplateService],
})
export class PdfModule {}

