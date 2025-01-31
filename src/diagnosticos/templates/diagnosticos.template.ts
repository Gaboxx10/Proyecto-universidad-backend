export class TemplateDiagnostico {
    async createDiagnostic(data){
          const docDefinition = {
            pageOrientation: 'landscape',
            content: [

              {
                text: `${data.empresa.nombre} - ${data.empresa.rif}`,
                style: 'header',
                alignment: 'center',
              },
              {
                text: 'Diagnóstico Vehicular',
                style: 'title',
                alignment: 'center',
              },
              {
                text: `Diagnóstico | Nº: D-001 | Fecha: ${data.created_at}`,
                style: 'subheader',
                alignment: 'center',
              },
      
              // Company, Client, and Vehicle Info
              {
                columns: [
                  {
                    text: 'Empresa',
                    style: 'infoTitle',
                  },
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
                    text: `${data.empresa.nombre}\n${data.empresa.rif}\n${data.empresa.telefono}\n${data.empresa.email}\n${data.empresa.direccion}`,
                    style: 'infoBox',
                  },
                  {
                    text: `${data.cliente.nombres} ${data.cliente.apellidos}\n${data.cliente.cedula}\n${data.cliente.telefono}\n${data.cliente.direccion}`,
                    style: 'infoBox',
                  },
                  {
                    text: `${data.vehiculo.placa}\n${data.vehiculo.marca}\n${data.vehiculo.modelo}\n${data.vehiculo.anio}\n${data.vehiculo.color}\n${data.vehiculo.kilometraje}`,
                    style: 'infoBox',
                  },
                ],
              },
      
              // Diagnostics Table
              {
                text: 'Diagnóstico',
                alignment: 'center',
                style: 'sectionHeader',
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
                    ...data.diagnosticoDetalle.map(diagnostico => {
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
                fontSize: 16,
                bold: true,
                color: '#005B96',
                margin: [0, 20, 0, 10],
              },
              title: {
                fontSize: 20,
                bold: true,
                color: '#005B96',
                margin: [0, 10, 0, 5],
              },
              subheader: {
                fontSize: 12,
                color: '#333333',
                margin: [0, 0, 0, 20],
              },
              infoTitle: {
                fontSize: 14,
                bold: true,
                color: '#005B96',
                margin: [0, 0, 0, 5],
              },
              infoBox: {
                fontSize: 12,
                color: '#333333',
                margin: [0, 0, 0, 10],
              },
              sectionHeader: {
                fontSize: 16,
                bold: true,
                color: '#005B96',
                margin: [0, 20, 0, 5],
              },
              tableHeader: {
                fontSize: 12,
                bold: true,
                color: '#fff',
                background: '#8B0000',
                alignment: 'center',
                padding: 10, // Aumentando el padding en las celdas de la tabla
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
      
    }
}