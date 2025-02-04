import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';
import { PrismaService } from '../prisma/prisma.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { Errors } from '../shared/errors.service';
import Decimal from 'decimal.js';

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

      let total_pagar = new Decimal(0); // Usar Decimal para total_pagar

      const detallesConImporte = detalles.map((item) => {
        const importe = new Decimal(item.cantidad).times(item.precio_unitario); // Usar Decimal para cálculo del importe
        total_pagar = total_pagar.plus(importe); // Usar Decimal para suma del total
        return {
          ...item,
          importe: importe.toFixed(2), // Redondear el importe a 2 decimales
        };
      });

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
        const today = new Date();

        const presupuesto = await prisma.presupuesto.create({
          data: {
            num_presupuesto,
            f_emision: today,
            f_validez: today,
            total_pagar: total_pagar.toFixed(2), // Redondear a 2 decimales
            vehiculo: {
              connect: {
                id: vehicle.data.id,
              },
            },
            detalles: {
              create: detallesConImporte.map((item) => ({
                descripcion: item.descripcion,
                cantidad: item.cantidad,
                precio_unitario: item.precio_unitario,
                importe: item.importe,
                nota: item.nota,
              })),
            },
          },
          include: {
            detalles: true,
          },
        });

        return presupuesto;
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
      const presupuestos = this.prisma.presupuesto.findMany({
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
      return {
        message: 'Presupuestos encontrados',
        data: presupuestos,
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
          vehiculo: true,
          detalles: true,
        },
      });

      if (!presupuesto) {
        throw new NotFoundException('Presupuesto no encontrado');
      }
      return {
        message: 'Presupuesto encontrado',
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

    try {
      const presupuesto = await this.prisma.presupuesto.findMany({
        where: {
          vehiculo: {
            placa: placa,
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
        throw new NotFoundException('Presupuesto no encontrado');
      }

      return presupuesto;
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
}
