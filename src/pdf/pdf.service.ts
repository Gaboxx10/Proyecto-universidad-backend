import { Injectable } from '@nestjs/common';
import PdfPrinter from 'pdfmake';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { TemplateService } from './templates/templateService';

const fonts = {
  Roboto: {
    normal: 'fonts/Roboto-Regular.ttf',
    bold: 'fonts/Roboto-Medium.ttf',
    italics: 'fonts/Roboto-Italic.ttf',
    bolditalics: 'fonts/Roboto-MediumItalic.ttf',
  },
};

@Injectable()
export class PdfService {
  private pdfPrinter = new PdfPrinter(fonts);
  constructor(
    private templateService: TemplateService,
  ) {}

  async generatePDF (data, docType: string) {
    try {
      if(docType === 'diagnostico') {
        const docDefinition = await this.templateService.generateDiagnosticDef(data);
        const pdfDoc = await this.createPdf(docDefinition);
        return pdfDoc;
      }else if(docType === "factura") {
        const docDefinition = await this.templateService.generateInvoiceDef(data);
        const pdfDoc = await this.createPdf(docDefinition);
        return pdfDoc;
      }else if(docType === "orden-trabajo"){
        const docDefinition = await this.templateService.generateOrdenDef(data);
        const pdfDoc = await this.createPdf(docDefinition);
        return pdfDoc;
      }

    } catch (error) {
      console.log(error);
    }
  }


  async createPdf(docDefinition: TDocumentDefinitions) {
    return this.pdfPrinter.createPdfKitDocument(docDefinition);
  }
  
}
