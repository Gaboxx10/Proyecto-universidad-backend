import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateFacturaDto } from './dto/create-factura.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from 'src/client/client.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import Decimal from 'decimal.js';
import { Errors } from 'src/shared/errors.service';
import { Pay } from './factura.controller';

@Injectable()
export class FacturaService {
  constructor(
    private prisma: PrismaService,
    private clientService: ClientService,
    private vehicleService: VehicleService,
    private errors: Errors,
  ) {}

  private entity = 'factura';

  async createFactura(createClientDto: CreateFacturaDto) {
    const { cedula_cliente, placa } = createClientDto;

    const company = await this.prisma.empresa.findFirst();
    const IVA = company.iva;

    try {
      const client = await this.clientService.findClientByCI(cedula_cliente);
      if (!client || client instanceof Error) {
        throw new NotFoundException('Cliente no encontrado');
      }

      const vehicle = await this.vehicleService.findVehicleByPlaca(placa);
      if (!vehicle || vehicle instanceof Error) {
        throw new NotFoundException('Vehículo no encontrado');
      }

      console.log('test', client, vehicle);

      const generarFactura = (factura: any) => {
        let subtotal = new Decimal(0);

        factura.details.forEach((detalle: any) => {
          const totalPorServicio = new Decimal(detalle.cantidad).times(
            new Decimal(detalle.precio_unitario),
          );
          subtotal = subtotal.plus(totalPorServicio); // Sumar al subtotal

          // Redondear el total por servicio a 2 decimales y guardarlo
          detalle['total'] = totalPorServicio.toFixed(2); // Convertir a string con 2 decimales
          // Redondear el precio unitario a 2 decimales
          detalle['precio_unitario'] = new Decimal(
            detalle.precio_unitario,
          ).toFixed(2); // Redondear y convertir a string
        });

        // Calcular el IVA con Decimal
        const iva = subtotal.times(new Decimal(IVA)).toFixed(2); // Redondear a 2 decimales
        // Calcular el total a pagar
        const totalPagar = subtotal.plus(new Decimal(iva)).toFixed(2); // Redondear a 2 decimales

        // Regresar los valores como números con precisión decimal
        return {
          cliente: client.data.id,
          vehicle: vehicle.data.id,
          f_entrada_veh: factura.f_entrada_veh,
          f_salida_veh: factura.f_salida_veh,
          detalles: factura.details,
          subtotal: subtotal.toNumber(), // Convertir a número
          iva: new Decimal(iva).toNumber(), // Convertir a número
          total_a_pagar: new Decimal(totalPagar).toNumber(), // Convertir a número
        };
      };

      const result = await this.prisma.$transaction(async (prisma) => {
        const factura = generarFactura(createClientDto);

        const lastFactura = await prisma.factura.findFirst({
          orderBy: {
            num_factura: 'desc',
          },
          select: {
            num_factura: true,
          },
        });

        const num_factura = lastFactura ? lastFactura.num_factura + 1 : 1;

        const facturaGenerada = await prisma.factura.create({
          data: {
            num_factura,
            f_entrada_veh: factura.f_entrada_veh,
            f_salida_veh: factura.f_salida_veh,
            subtotal: factura.subtotal,
            iva: factura.iva,
            total_pagar: factura.total_a_pagar,
            detalles: {
              create: factura.detalles.map((detalle) => ({
                cantidad: detalle.cantidad,
                descripcion: detalle.descripcion,
                precio_unitario: detalle.precio_unitario,
                total: detalle.total,
              })),
            },
            Vehiculo: {
              connect: {
                id: vehicle.data.id,
              },
            },
            cliente: {
              connect: {
                id: client.data.id,
              },
            },
          },
          include: {
            detalles: true,
          },
        });
        return facturaGenerada;
      });

      return {
        message: 'Factura generada exitosamente',
        factura: result,
        statusCode: 201,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findAllFacturas(offset: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    try {
      const facturas = await this.prisma.factura.findMany({
        skip,
        take: limit,
        orderBy: {
          num_factura: 'desc',
        },
        include: {
          detalles: true,
          cliente: {
            include: {
              datos: true,
            },
          },
          Vehiculo: true,
        },
      });

      if (!facturas || facturas.length === 0) {
        throw new NotFoundException('No se encontraron facturas');
      }

      return {
        message: 'Facturas encontradas',
        data: facturas,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findFacturaById(id: string) {
    try {
      const factura = await this.prisma.factura.findUnique({
        where: {
          id,
        },
        include: {
          detalles: true,
          cliente: {
            include: {
              datos: true,
            },
          },
          Vehiculo: true,
        },
      });

      if (!factura) {
        throw new NotFoundException('Factura no encontrada');
      }

      return {
        message: 'Factura encontrada',
        data: factura,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async confirmPay(id: string, data: Pay) {
    const invoice = await this.prisma.factura.findUnique({
      where: {
        id,
      },
    });

    if (!invoice) {
      throw new NotFoundException('Factura no encontrada');
    }

    try {
      if (invoice.pago === true) {
        throw new BadRequestException('La factura ya ha sido pagada');
      }

      const factura = await this.prisma.factura.update({
        where: {
          id,
        },
        data: {
          pago: data.confirm,
        },
      });

      return {
        message: 'Factura pagada',
        data: factura,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async deleteFactura(id: string) {
    const factura = await this.prisma.factura.findUnique({
      where: {
        id,
      },
    });

    if (!factura) {
      throw new NotFoundException('Factura no encontrada');
    }

    try {
      const deleted = await this.prisma.factura.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Factura eliminada',
        data: deleted,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async printFactura(id: string) {
    try {
      const factura = await this.prisma.factura.findUnique({
        where: {
          id,
        },
        include: {
          detalles: true,
          cliente: {
            include: {
              datos: true,
            },
          },
          Vehiculo: true,
        },
      });

      if (!factura) {
        throw new NotFoundException('Factura no encontrada');
      }

      return {
        data: factura,
        docType: this.entity,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
