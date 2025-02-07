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
              text: `${company.nombre} ${company.razon_social} | ${company.rif_detalles}\n`,
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
                {
                  text: 'Observación',
                  bold: true,
                  color: '#000000',
                  alignment: 'center',
                },
                {
                  text: 'Causa Probable',
                  bold: true,
                  color: '#000000',
                  alignment: 'center',
                },
                {
                  text: 'Solución',
                  bold: true,
                  color: '#000000',
                  alignment: 'center',
                },
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
            text: `${company.nombre} ${company.razon_social} | ${company.rif_detalles} | ${company.telefono}`,
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

  async generateInvoiceDef(facturaData: any): Promise<TDocumentDefinitions> {
    const company = await this.getCompanyData();

    const formattedDate = new Date(facturaData.f_emision).toLocaleDateString(
      'es-ES',
    );
    const formattedEntrada = new Date(
      facturaData.f_entrada_veh,
    ).toLocaleDateString('es-ES');
    const formattedSalida = new Date(
      facturaData.f_salida_veh,
    ).toLocaleDateString('es-ES');

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: `Factura`,
          style: 'header',
          alignment: 'left',
        },
        {
          text: [
            {
              text: `${company.nombre} ${company.razon_social} | ${company.rif_detalles}\n`,
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
            { text: 'Factura Nº: ', bold: true, color: '#2196F3' }, // Azul
            `${facturaData.num_factura.toString()}  |  `,
            { text: 'Fecha: ', bold: true, color: '#2196F3' }, // Azul
            `${formattedDate}`,
          ],
        },
        {
          style: 'subheader',
          alignment: 'center',
          text: [
            { text: 'Entrada Vehículo: ', bold: true, color: '#2196F3' }, // Azul
            `${formattedEntrada}  |  `,
            { text: 'Salida Vehículo: ', bold: true, color: '#2196F3' }, // Azul
            `${formattedSalida}`,
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
                `${facturaData.cliente.datos.nombres} ${facturaData.cliente.datos.apellidos}\n`,
                { text: 'Cédula/RIF: ', bold: true },
                `${facturaData.cliente.datos.cedula_id_detalles}\n`,
                { text: 'Teléfono: ', bold: true },
                `${facturaData.cliente.datos.telefono}\n`,
                { text: 'Dirección: ', bold: true },
                `${facturaData.cliente.datos.direccion}`,
              ],
              style: 'infoBox',
            },
            {
              text: [
                { text: 'Placa: ', bold: true },
                `${facturaData.Vehiculo.placa}\n`,
                { text: 'Marca: ', bold: true },
                `${facturaData.Vehiculo.marca}\n`,
                { text: 'Modelo: ', bold: true },
                `${facturaData.Vehiculo.modelo}\n`,
                { text: 'Año: ', bold: true },
                `${facturaData.Vehiculo.año.toString()}\n`,
                { text: 'Color: ', bold: true },
                `${facturaData.Vehiculo.color}\n`,
                { text: 'Kilometraje: ', bold: true },
                `${facturaData.Vehiculo.kilometraje.toString()}`,
              ],
              style: 'infoBox',
            },
          ],
        },
        {
          table: {
            widths: ['*', '*', 'auto', '*'],
            body: [
              [
                { text: 'Descripción', bold: true, color: '#000000' },
                { text: 'Cantidad', bold: true, color: '#000000' },
                { text: 'Precio Unitario', bold: true, color: '#000000' },
                { text: 'Total', bold: true, color: '#000000' },
              ],
              ...facturaData.detalles.map((detalle) => {
                return [
                  detalle.descripcion || 'No disponible',
                  detalle.cantidad.toString() || '0',
                  `${company.moneda}${parseFloat(detalle.precio_unitario).toFixed(2)}`,
                  `${company.moneda}${parseFloat(detalle.total).toFixed(2)}`,
                ];
              }),
            ],
          },
          layout: 'lightHorizontalLines',
          alignment: 'center',
        },
        {
          columns: [
            {
              text: [
                { text: 'Subtotal: ', bold: true, color: '#2196F3' }, // Azul
                `${company.moneda} ${parseFloat(facturaData.subtotal).toFixed(2)}`,
              ],
              style: 'tableData',
              alignment: 'right',
            },
          ],
        },
        {
          columns: [
            {
              text: [
                { text: `I.V.A: `, bold: true, color: '#2196F3' }, // Azul
                `${company.moneda} ${parseFloat(facturaData.iva).toFixed(2)}`,
              ],
              style: 'tableData',
              alignment: 'right',
            },
          ],
        },
        {
          columns: [
            {
              text: [
                { text: 'Total a Pagar: ', bold: true, color: '#2196F3' }, // Azul
                `${company.moneda} ${parseFloat(facturaData.total_pagar).toFixed(2)}`,
              ],
              style: 'tableData',
              alignment: 'right',
            },
          ],
        },
      ],
      footer: {
        columns: [
          {
            text: `${company.nombre} ${company.razon_social} | ${company.rif_detalles} | ${company.telefono}`,
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
          color: '#2196F3', // Azul
          margin: [0, 20, 0, 10],
        },
        subheader: {
          fontSize: 14,
          color: '#333333',
          margin: [0, 0, 0, 20],
        },
        sectionHeader: {
          fontSize: 16,
          bold: true,
          color: '#2196F3', // Azul
          margin: [0, 20, 0, 5],
        },
        infoTitle: {
          fontSize: 15,
          bold: true,
          color: '#2196F3', // Azul
          margin: [0, 0, 0, 5],
        },
        infoBox: {
          fontSize: 10,
          color: '#333333',
          margin: [0, 0, 0, 10],
          lineHeight: 1.5,
        },
        tableHeader: {
          fontSize: 13,
          bold: true,
          color: '#fff',
          background: '#2196F3', // Azul
          alignment: 'center',
        },
        tableData: {
          fontSize: 12,
          color: '#333333',
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

  async generateOrdenDef(ordenData: any): Promise<TDocumentDefinitions> {
    const company = await this.getCompanyData();

    const formattedCreationDate = new Date(
      ordenData.f_creacion,
    ).toLocaleDateString('es-ES');
    const formattedDeliveryDate = new Date(
      ordenData.f_entrega_estimada,
    ).toLocaleDateString('es-ES');

    ordenData.nota_adicional =
      ordenData.nota_adicional || 'No hay nota adicional';

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: `Orden de Trabajo`,
          style: 'header',
          alignment: 'left',
        },
        {
          text: [
            {
              text: `${company.nombre} ${company.razon_social} | ${company.rif_detalles}\n`,
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
            { text: 'Orden Nº: ', bold: true, color: '#7B1FA2' }, // Morado
            `${ordenData.num_orden}  |  `,
            { text: 'Fecha: ', bold: true, color: '#7B1FA2' }, // Morado
            `${formattedCreationDate}`,
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
                `${ordenData.vehiculo.cliente.datos.nombres} ${ordenData.vehiculo.cliente.datos.apellidos}\n`,
                { text: 'Cédula/RIF: ', bold: true },
                `${ordenData.vehiculo.cliente.datos.cedula_identidad}\n`,
                { text: 'Teléfono: ', bold: true },
                `${ordenData.vehiculo.cliente.datos.telefono}\n`,
                { text: 'Dirección: ', bold: true },
                `${ordenData.vehiculo.cliente.datos.direccion}`,
              ],
              style: 'infoBox',
            },
            {
              text: [
                { text: 'Placa: ', bold: true },
                `${ordenData.vehiculo.placa}\n`,
                { text: 'Marca: ', bold: true },
                `${ordenData.vehiculo.marca}\n`,
                { text: 'Modelo: ', bold: true },
                `${ordenData.vehiculo.modelo}\n`,
                { text: 'Año: ', bold: true },
                `${ordenData.vehiculo.año.toString()}\n`,
                { text: 'Color: ', bold: true },
                `${ordenData.vehiculo.color}\n`,
                { text: 'Kilometraje: ', bold: true },
                `${ordenData.vehiculo.kilometraje.toString()}`,
              ],
              style: 'infoBox',
            },
          ],
        },
        {
          text: [
            {
              text: 'Fecha Estimada de Entrega: ',
              bold: true,
              color: '#7B1FA2', // Morado
              fontSize: 14,
            },
            `${formattedDeliveryDate}`,
          ],
          style: 'infoBox',
          fontSize: 14,
          margin: [0, 20],
        },
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                {
                  text: 'Observación',
                  alignment: 'center',
                  bold: true,
                  color: '#000000',
                },
                {
                  text: 'Solución',
                  alignment: 'center',
                  bold: true,
                  color: '#000000',
                },
                {
                  text: 'Descripción',
                  alignment: 'center',
                  bold: true,
                  color: '#000000',
                },
                {
                  text: 'Cantidad',
                  alignment: 'center',
                  bold: true,
                  color: '#000000',
                },
              ],
              ...ordenData.detalles.map((detalle) => {
                return [
                  detalle.observacion || 'No disponible',
                  detalle.solucion || 'No disponible',
                  detalle.descripcion || 'No disponible',
                  {
                    text: detalle.cantidad.toString() || 'No disponible',
                    alignment: 'center',
                  },
                ];
              }),
            ],
          },
          layout: 'lightHorizontalLines',
        },

        [
          {
            text: [
              { text: 'Nota Adicional: ', bold: true, color: '#7B1FA2' }, // Morado
              `${ordenData.nota_adicional}`,
            ],
            style: 'infoBox',
            margin: [0, 50],
            fontSize: 12,
          },
        ],
      ],

      footer: {
        columns: [
          {
            text: `${company.nombre} ${company.razon_social} | ${company.rif_detalles} | ${company.telefono}`,
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
          color: '#7B1FA2', // Morado
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
          color: '#7B1FA2', // Morado
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
          color: '#7B1FA2', // Morado
          margin: [0, 20, 0, 5],
        },
        tableHeader: {
          fontSize: 13,
          bold: true,
          color: '#fff',
          background: '#7B1FA2', // Morado
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

  async generatePresupuestoDef(data: any): Promise<TDocumentDefinitions> {
    const company = await this.getCompanyData();

    // Usamos `f_emision` para la fecha de creación
    const formattedCreationDate = new Date(data.f_emision).toLocaleDateString(
      'es-ES',
    );
    const formattedValidityDate = formattedCreationDate;

    // Si no hay un campo `f_entrega_estimada`, agregamos una fecha ficticia de entrega (o puedes ajustar esto)
    const formattedDeliveryDate = new Date().toLocaleDateString('es-ES'); // o una fecha estimada

    // Si no existe nota adicional, establecemos un valor predeterminado
    data.nota_adicional = data.nota_adicional || 'No hay nota adicional';

    const docDefinition: TDocumentDefinitions = {
      content: [
        {
          text: `Presupuesto`,
          style: 'header',
          alignment: 'left',
        },
        {
          text: [
            {
              text: `${company.nombre} ${company.razon_social} | ${company.rif_detalles}\n`,
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
            { text: 'Presupuesto Nº: ', bold: true, color: '#388E3C' }, // Verde
            `${data.num_presupuesto}  |  `,
            { text: 'Fecha: ', bold: true, color: '#388E3C' }, // Verde
            `${formattedCreationDate}`,
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
                `${data.vehiculo.cliente.datos.nombres} ${data.vehiculo.cliente.datos.apellidos}\n`,
                { text: 'Cédula/RIF: ', bold: true },
                `${data.vehiculo.cliente.datos.cedula_identidad}\n`,
                { text: 'Teléfono: ', bold: true },
                `${data.vehiculo.cliente.datos.telefono}\n`,
                { text: 'Dirección: ', bold: true },
                `${data.vehiculo.cliente.datos.direccion}`,
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
                `${data.vehiculo.año.toString()}\n`,
                { text: 'Color: ', bold: true },
                `${data.vehiculo.color}\n`,
                { text: 'Kilometraje: ', bold: true },
                `${data.vehiculo.kilometraje.toString()}`,
              ],
              style: 'infoBox',
            },
          ],
        },
        {
          text: [
            {
              text: 'Fecha de Emisión: ',
              bold: true,
              color: '#388E3C',
              fontSize: 14,
            },
            `${formattedCreationDate}  |  `,
            {
              text: 'Valido hasta: ',
              bold: true,
              color: '#388E3C',
              fontSize: 14,
            },
            `${formattedCreationDate}`,
          ],
          style: 'infoBox',
          alignment: 'center',
          fontSize: 14,
          margin: [0, 20],
        },
        {
          table: {
            widths: ['*', '*', '*', '*'],
            body: [
              [
                {
                  text: 'Descripción',
                  alignment: 'center',
                  bold: true,
                  color: '#000000',
                },
                {
                  text: 'Cantidad',
                  alignment: 'center',
                  bold: true,
                  color: '#000000',
                },
                {
                  text: 'Precio Unitario',
                  alignment: 'center',
                  bold: true,
                  color: '#000000',
                },
                {
                  text: 'Total',
                  alignment: 'center',
                  bold: true,
                  color: '#000000',
                },
              ],
              ...data.detalles.map((detalle) => {
                return [
                  detalle.descripcion || 'No disponible',
                  {
                    text:  detalle.cantidad.toString() || 'No disponible',
                    alignment: 'center',
                  },
                  {
                    text: `${company.moneda} ${parseFloat(detalle.precio_unitario).toFixed(2)}` ||
                      'No disponible',
                    alignment: 'center',
                  },
                  {
                    text:
                      `${company.moneda} ${parseFloat(detalle.importe).toFixed(2)}` ||
                      'No disponible',
                    alignment: 'center',
                  },
                ];
              }),
            ],
          },
          layout: 'lightHorizontalLines',
        },
        {
          columns: [
            {
              text: [
                { text: 'Total a Pagar: ', bold: true, color: '#388E3C' },
                `${company.moneda} ${parseFloat(data.total_pagar).toFixed(2)}`,
              ],
              style: 'tableData',
              alignment: 'right',
              marginTop: 20
            },
          ],
        },
      ],

      footer: {
        columns: [
          {
            text: `${company.nombre} ${company.razon_social} | ${company.rif_detalles} | ${company.telefono}`,
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
          color: '#388E3C', // Verde
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
          color: '#388E3C', // Verde
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
          color: '#388E3C', // Verde
          margin: [0, 20, 0, 5],
        },
        tableHeader: {
          fontSize: 13,
          bold: true,
          color: '#fff',
          background: '#388E3C', // Verde
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
