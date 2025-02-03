import { Controller, Get, Res } from '@nestjs/common';
import { PdfService } from './pdf.service';
import { Response } from 'express';
import { TDocumentDefinitions } from 'pdfmake/interfaces';

@Controller('pdf')
export class PdfController {
  constructor(private readonly pdfService: PdfService) {}

  @Get('/pdf/generate')
  async generatePdf(@Res() res: Response) {
    const data = {
      docType: 'Diagnostico',
      empresa: {
        nombre: 'Auto Diagnósticos S.A.',
        rif: 'J-12345678-9',
        telefono: '0212-3456789',
        email: 'contacto@autodiagnosticos.com',
        direccion: 'Av. Principal, Caracas, Venezuela',
      },
      cliente: {
        nombres: 'Juan',
        apellidos: 'Pérez',
        cedula: 'V-12345678',
        telefono: '0412-1234567',
        direccion: 'Calle Falsa 123, Caracas, Venezuela',
      },
      vehiculo: {
        placa: 'ABC-123',
        marca: 'Toyota',
        modelo: 'Corolla',
        anio: '2020',
        color: 'Blanco',
        kilometraje: '25,000 km',
      },
      diagnostico: {
        num_diagnostico: 47,
        created_at: '2023-07-25',
      },
      diagnosticoDetalle: [
        {
          observacion: 'Frenos con desgaste',
          causaProbable: 'Uso excesivo de los frenos',
          solucion: 'Reemplazar pastillas de freno',
        },
        {
          observacion: 'Aceite motor bajo nivel',
          causaProbable: 'Fugas en el sistema de aceite',
          solucion: 'Revisar y reparar las fugas',
        },
        {
          observacion: 'Frenos con desgaste',
          causaProbable: 'Uso excesivo de los frenos',
          solucion: 'Reemplazar pastillas de freno',
        },
        {
          observacion: 'Aceite motor bajo nivel',
          causaProbable: 'Fugas en el sistema de aceite',
          solucion: 'Revisar y reparar las fugas',
        },
        {
          observacion: 'Frenos con desgaste',
          causaProbable: 'Uso excesivo de los frenos',
          solucion: 'Reemplazar pastillas de freno',
        },
        {
          observacion: 'Aceite motor bajo nivel',
          causaProbable: 'Fugas en el sistema de aceite',
          solucion: 'Revisar y reparar las fugas',
        },
        {
          observacion: 'Frenos con desgaste',
          causaProbable: 'Uso excesivo de los frenos',
          solucion: 'Reemplazar pastillas de freno',
        },
        {
          observacion: 'Aceite motor bajo nivel',
          causaProbable: 'Fugas en el sistema de aceite',
          solucion: 'Revisar y reparar las fugas',
        },
      ],
      created_at: '02/02/2025',
    };

    const docDefinition = {
      pageOrientation: 'landscape',
      content: [
        {
          text: `${data.docType}`,
          style: 'header',
          alignment: 'start',
        },
        {
          text: [
            {
              text: `${data.empresa.nombre} | ${data.empresa.rif}\n`,
              color: '#333333',
            },
            { text: `${data.empresa.direccion}\n`, color: '#333333' },
            { text: `${data.empresa.email}\n`, color: '#333333' },
            { text: `${data.empresa.telefono}\n`, color: '#333333' },
          ],
          style: 'infoBox',
          alignment: 'start',
        },
        {
          style: 'subheader',
          alignment: 'center',
          text: [
            { text: 'Diagnóstico Nº: ', bold: true, color: '#D32F2F' }, // Rojo más brillante
            `${data.diagnostico.num_diagnostico}  |  `,
            { text: 'Fecha: ', bold: true, color: '#C62828' }, // Rojo intermedio
            `${data.diagnostico.created_at}`,
          ],
        },

        // Información del Cliente y Vehículo
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
                `${data.cliente.nombres} ${data.cliente.apellidos}\n`,
                { text: 'Cédula/RIF: ', bold: true },
                `${data.cliente.cedula}\n`,
                { text: 'Teléfono: ', bold: true },
                `${data.cliente.telefono}\n`,
                { text: 'Dirección: ', bold: true },
                `${data.cliente.direccion}`,
              ],
              style: 'infoBox',
            },
            {
              text: [
                { text: 'Placa: ', bold: true },
                `${data.vehiculo.placa}\n`,
                { text: 'Marca: ', bold: true },
                `${data.vehiculo.marca}\n`,
                { text: 'Modelo: ', bold: true },
                `${data.vehiculo.modelo}\n`,
                { text: 'Año: ', bold: true },
                `${data.vehiculo.anio}\n`,
                { text: 'Color: ', bold: true },
                `${data.vehiculo.color}\n`,
                { text: 'Kilometraje: ', bold: true },
                `${data.vehiculo.kilometraje}`,
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
              ...data.diagnosticoDetalle.map((diagnostico) => {
                return [
                  diagnostico.observacion,
                  diagnostico.causaProbable,
                  diagnostico.solucion,
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
            text: `${data.empresa.nombre} | ${data.empresa.rif} | ${data.empresa.telefono}`,
            alignment: 'left',
            style: 'footerText',
          },
          {
            text: `${data.empresa.email} | ${data.empresa.direccion}`,
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
          color: '#B71C1C', // Rojo oscuro
          margin: [0, 20, 0, 10],
        },
        title: {
          fontSize: 18,
          bold: true,
          color: '##333333', // Rojo intermedio
          margin: [0, 10, 0, 5],
        },
        subheader: {
          fontSize: 14,
          color: '##333333', // Rojo brillante
          margin: [0, 0, 0, 20],
        },
        infoTitle: {
          fontSize: 15,
          bold: true,
          color: '#C62828', // Rojo intermedio
          margin: [0, 0, 0, 5],
        },
        infoBox: {
          fontSize: 10,
          color: '##333333', // Rojo oscuro
          margin: [0, 0, 0, 10],
          lineHeight: 1.5,
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          color: '#D32F2F', // Rojo brillante
          margin: [0, 20, 0, 5],
        },
        tableHeader: {
          fontSize: 13,
          bold: true,
          color: '#fff', // Blanco
          background: '#C62828', // Rojo intermedio para el fondo
          alignment: 'center',
          padding: 10,
        },
        body: {
          fontSize: 12,
          margin: [0, 5, 0, 5],
        },
        footerText: {
          fontSize: 10,
          color: '##333333', // Rojo oscuro
        },
      },
    };


  }
}
