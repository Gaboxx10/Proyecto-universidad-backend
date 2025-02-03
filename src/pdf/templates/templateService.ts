import { Injectable } from '@nestjs/common';
import { TDocumentDefinitions } from 'pdfmake/interfaces';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class TemplateService {
  constructor(private prisma: PrismaService) {}

  async getCompanyData() {
    const companyData = await this.prisma.empresa.findFirst();
    return companyData;
  }

  async generateDiagnosticDef(
    diagnosticData: any,
  ): Promise<TDocumentDefinitions> {

    const company = await this.getCompanyData();

    const formattedDate = new Date(
      diagnosticData.created_at,
    ).toLocaleDateString('es-ES'); 

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: `Diagnóstico`,
          style: 'header',
          alignment: 'left',
        },
        {
          text: [
            {
              text: `${company.nombre} | ${company.rif}\n`,
              color: '#333333',
            },
            { text: `${company.direccion}\n`, color: '#333333' },
            { text: `${company.email}\n`, color: '#333333' },
            { text: `${company.telefono}\n`, color: '#333333' },
          ],
          style: 'infoBox',
          alignment: 'left',
        },
        {
          style: 'subheader',
          alignment: 'center',
          text: [
            { text: 'Diagnóstico Nº: ', bold: true, color: '#D32F2F' },
            `${diagnosticData.num_diagnostico.toString()}  |  `, 
            { text: 'Fecha: ', bold: true, color: '#C62828' },
            `${formattedDate}`,
          ],
        },
      
        {
          columns: [
            {
              text: 'Cliente',
              style: 'infoTitle',
            },
            {
              text: 'Vehículo',
              style: 'infoTitle',
            },
          ],
        },
        {
          columns: [
            {
              text: [
                { text: 'Nombre: ', bold: true },
                `${diagnosticData.vehiculo.cliente.datos.nombres} ${diagnosticData.vehiculo.cliente.datos.apellidos}\n`,
                { text: 'Cédula/RIF: ', bold: true },
                `${diagnosticData.vehiculo.cliente.datos.cedula_identidad}\n`,
                { text: 'Teléfono: ', bold: true },
                `${diagnosticData.vehiculo.cliente.datos.telefono}\n`,
                { text: 'Dirección: ', bold: true },
                `${diagnosticData.vehiculo.cliente.datos.direccion}`,
              ],
              style: 'infoBox',
            },
            {
              text: [
                { text: 'Placa: ', bold: true },
                `${diagnosticData.vehiculo.placa}\n`,
                { text: 'Marca: ', bold: true },
                `${diagnosticData.vehiculo.marca}\n`,
                { text: 'Modelo: ', bold: true },
                `${diagnosticData.vehiculo.modelo}\n`,
                { text: 'Año: ', bold: true },
                `${diagnosticData.vehiculo.año.toString()}\n`, 
                { text: 'Color: ', bold: true },
                `${diagnosticData.vehiculo.color}\n`,
                { text: 'Kilometraje: ', bold: true },
                `${diagnosticData.vehiculo.kilometraje.toString()}`,
              ],
              style: 'infoBox',
            },
          ],
        },
        {
          table: {
            widths: ['*', '*', '*'],
            body: [
              [
                { text: 'Observación', style: 'tableHeader' },
                { text: 'Causa Probable', style: 'tableHeader' },
                { text: 'Solución', style: 'tableHeader' },
              ],
              ...diagnosticData.revisiones.map((revision) => {
                return [
                  revision.observacion || 'No disponible',
                  revision.causa_prob || 'No disponible',
                  revision.solucion || 'No disponible',
                ];
              }),
            ],
          },
          layout: 'lightHorizontalLines',
        },
      ],
      footer: {
        columns: [
          {
            text: `${company.nombre} | ${company.rif} | ${company.telefono}`,
            alignment: 'left',
            style: 'footerText',
          },
          {
            text: `${company.email} | ${company.direccion}`,
            alignment: 'right',
            style: 'footerText',
          },
        ],
        margin: [20, 10],
      },
      styles: {
        header: {
          fontSize: 20,
          bold: true,
          color: '#B71C1C', 
          margin: [0, 20, 0, 10],
        },
        title: {
          fontSize: 18,
          bold: true,
          color: '#333333',
          margin: [0, 10, 0, 5],
        },
        subheader: {
          fontSize: 14,
          color: '#333333',
          margin: [0, 0, 0, 20],
        },
        infoTitle: {
          fontSize: 15,
          bold: true,
          color: '#C62828',
          margin: [0, 0, 0, 5],
        },
        infoBox: {
          fontSize: 10,
          color: '#333333',
          margin: [0, 0, 0, 10],
          lineHeight: 1.5,
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          color: '#D32F2F',
          margin: [0, 20, 0, 5],
        },
        tableHeader: {
          fontSize: 13,
          bold: true,
          color: '#fff',
          background: '#C62828',
          alignment: 'center',
        },
        body: {
          fontSize: 12,
          margin: [0, 5, 0, 5],
        },
        footerText: {
          fontSize: 10,
          color: '#333333',
        },
      },
    };

    return docDefinition;
  }
}
