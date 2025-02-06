import {
  BadRequestException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';
import { PrismaService } from '../prisma/prisma.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { Errors } from '../shared/errors.service';
import Decimal from 'decimal.js';
import { formatPresupuestoData } from './utils/format-presupuesto.util';

@Injectable()
export class PresupuestoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vehicleService: VehicleService,
    private readonly errors: Errors,
  ) {}

  private entity = 'presupuesto';

  async createPresupuesto(createPresupuestoDto: CreatePresupuestoDto) {
    const { placa, detalles } = createPresupuestoDto;
    try {
      const vehicle = await this.vehicleService.findVehicleByPlaca(placa);
      if (!vehicle || vehicle instanceof Error) {
        throw new NotFoundException('Vehículo no encontrado');
      }

      const generarPresupuesto = (presupuesto: any) => {
        let totalPagar = new Decimal(0);

        presupuesto.detalles.forEach((detalle: any) => {
          const importe = new Decimal(detalle.cantidad).times(
            new Decimal(detalle.precio_unitario),
          );

          totalPagar = totalPagar.plus(importe);

          detalle['importe'] = importe.toFixed(2);
          detalle['precio_unitario'] = new Decimal(
            detalle.precio_unitario,
          ).toFixed(2);
        });

        return {
          vehicle: vehicle.data.id,
          f_emision: new Date(),
          f_validez: new Date(),
          detalles: presupuesto.detalles,
          total_pagar: totalPagar.toNumber(),
        };
      };

      const result = await this.prisma.$transaction(async (prisma) => {
        const lastPresupuesto = await prisma.presupuesto.findFirst({
          orderBy: {
            num_presupuesto: 'desc',
          },
          select: {
            num_presupuesto: true,
          },
        });

        const num_presupuesto = lastPresupuesto
          ? lastPresupuesto.num_presupuesto + 1
          : 1;

        const presupuesto = generarPresupuesto(createPresupuestoDto);

        const presupuestoGenerado = await prisma.presupuesto.create({
          data: {
            num_presupuesto,
            f_emision: presupuesto.f_emision,
            f_validez: presupuesto.f_validez,
            total_pagar: presupuesto.total_pagar.toFixed(2), // Redondear a 2 decimales
            vehiculo: {
              connect: {
                id: presupuesto.vehicle,
              },
            },
            detalles: {
              create: presupuesto.detalles.map((detalle) => ({
                descripcion: detalle.descripcion,
                cantidad: detalle.cantidad,
                precio_unitario: detalle.precio_unitario,
                importe: detalle.importe,
                nota: detalle.nota,
              })),
            },
          },
          include: {
            detalles: true,
          },
        });

        return presupuestoGenerado;
      });

      return {
        message: 'Presupuesto creado exitosamente',
        data: result,
        statusCode: 201,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findAllPresupuestos(offset: number) {
    const limit = 10;
    const page = offset || 1;
    const skip = (page - 1) * limit;

    try {
      const presupuestos = await this.prisma.presupuesto.findMany({
        skip,
        take: limit,
        orderBy: {
          num_presupuesto: 'desc',
        },
        include: {
          vehiculo: true,
          detalles: true,
        },
      });

      if (presupuestos.length === 0) {
        throw new NotFoundException('No se encontraron presupuestos');
      }

      console.log(presupuestos);
      const formattedPresupuestos = formatPresupuestoData(presupuestos);

      return {
        message: 'Presupuestos encontrados',
        data: formattedPresupuestos,
        status: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findPresupuestoById(id: string) {
    try {
      const presupuesto = await this.prisma.presupuesto.findUnique({
        where: { id },
        include: {
          vehiculo: {
            include: {
              cliente: {
                include: {
                  datos: true,
                },
              },
            },
          },
          detalles: true,
        },
      });

      if (!presupuesto) {
        throw new NotFoundException('Presupuesto no encontrado');
      }

      const formattedPresupuesto = formatPresupuestoData(presupuesto);

      return {
        message: 'Presupuesto encontrado',
        data: formattedPresupuesto,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async searchPresupuestos(search: string, offset: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    const placa_vehiculo = search.toUpperCase();
    let num_presupuesto = parseInt(search);

    if (isNaN(num_presupuesto)) {
      num_presupuesto = undefined;
    }

    try {
      let presupuesto = await this.prisma.presupuesto.findMany({
        where: {
          OR: [
            {
              num_presupuesto: {
                equals: num_presupuesto,
              },
            },
            {
              vehiculo: {
                placa: placa_vehiculo,
              },
            },
          ],
        },
        include: {
          detalles: true,
          vehiculo: true,
        },
        skip,
        take: limit,
        orderBy: {
          num_presupuesto: 'desc',
        },
      });

      if (!presupuesto || presupuesto.length === 0) {
        throw new NotFoundException('No se encontraron presupuestos');
      }

      return {
        message: 'Presupuestos encontrados',
        data: presupuesto,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findPresupuestoByPlaca(offset: string, placa: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    if (!placa) {
      throw new BadRequestException('El parámetro "placa" es requerido');
    }

    const UPPER = placa.toUpperCase();

    try {
      const presupuesto = await this.prisma.presupuesto.findMany({
        where: {
          vehiculo: {
            placa: UPPER,
          },
        },
        orderBy: {
          num_presupuesto: 'desc',
        },
        skip,
        take: limit,

        include: {
          vehiculo: true,
          detalles: true,
        },
      });

      if (presupuesto.length === 0) {
        throw new NotFoundException('Presupuestos no encontrados');
      }

      const formattedPresupuesto = formatPresupuestoData(presupuesto);

      return {
        message: 'Presupuestos encontrados',
        data: formattedPresupuesto,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  //update(id: number, updatePresupuestoDto: UpdatePresupuestoDto) {
  //return `This action updates a #${id} presupuesto`;
  //}

  async deletePresupuesto(id: string) {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const presupuesto = await prisma.presupuesto.findUnique({
          where: { id },
        });

        if (!presupuesto) {
          throw new NotFoundException('Presupuesto no encontrado');
        }

        await prisma.presupuesto.delete({
          where: { id },
        });

        return presupuesto;
      });
      return {
        message: 'Presupuesto eliminado exitosamente',
        presupuesto: result,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async printPresupuesto(id: string) {
    try {
      const presupuesto = await this.prisma.presupuesto.findUnique({
        where: { id },
        include: {
          vehiculo: {
            include: {
              cliente: {
                include: {
                  datos: true,
                },
              },
            },
          },
          detalles: true,
        },
      });

      if (!presupuesto) {
        throw new NotFoundException('Presupuesto no encontrado');
      }

      const formattedPresupuesto = formatPresupuestoData(presupuesto);

      return {
        data: formattedPresupuesto,
        docType: this.entity,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
