import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { EstadoReparacion, Modules } from 'src/constants/constants';

export function formatFacturaData(data) {
  if (Array.isArray(data)) {
      data.forEach((item) => {
          formatFactura(item);
      });
  } else {
      formatFactura(data);
  }

  return data;
}

function formatFactura(data) {
  data.total_pagar = parseFloat(data.total_pagar).toFixed(2);
}


@Injectable()
export class DashboardService {
  constructor(private prisma: PrismaService) {}

  private entity = Modules.dashboard;

  async findAllCount() {
    try {
      const clients = await this.prisma.cliente.count();
      const vehicles = await this.prisma.vehiculo.count();
      const diagnostic = await this.prisma.diagnostico.count();
      const presupuestos = await this.prisma.presupuesto.count();
      const ordenes = await this.prisma.ordenTrabajo.count();
      const invoice = await this.prisma.factura.count();
      const providers = await this.prisma.proveedores.count();

      const vehiclesInWorkshop = await this.prisma.vehiculo.findMany({
        where: {
          OR: [
            {
              estado: EstadoReparacion.EN_REPARACION,
            },
            {
              estado: EstadoReparacion.EN_MANTENIMIENTO,
            },
          ],
        },
        select: {
          id: true,
          placa: true,
          marca: true,
          modelo: true,
          estado: true,
        }
      });


      const facturasSinPagar = await this.prisma.factura.findMany({
        where: {
          pago: false,
        },
          select: {
          id: true,
          num_factura: true,
          total_pagar: true,
          pago: true,
          cliente: {
            include: {
              datos: {
                select: {
                  nombres: true,
                  apellidos: true,
                }
              }
            }
          },
        },
        orderBy: {
           num_factura: 'desc',
        }
      });

      const facturas = {
        data: [],
      }

      if(facturasSinPagar.length > 0) {
        facturas.data = formatFacturaData(facturasSinPagar)
      }

      return {
        clients: clients,
        vehicles: vehicles,
        diagnostic: diagnostic,
        presupuestos: presupuestos,
        ordenes: ordenes,
        facturas: invoice,
        providers: providers,
        facturasPendientes: facturas.data,
        vehiculostaller: vehiclesInWorkshop
      };
    } catch (error) {
      console.error(error);
    }
  }
}
