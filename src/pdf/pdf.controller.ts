import { Controller, Get, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('/pdf/generate')
  async generatePdf(template: TDocumentDefinitions, @Res() res: Response) {

    const pdf = await this.pdfService.generatePdf(template);

    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename="factura_orden_trabajo.pdf"');
    
    pdf.pipe(res);
    pdf.end();
  }
}
