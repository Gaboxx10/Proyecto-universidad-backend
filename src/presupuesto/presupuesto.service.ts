import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';
import { PrismaService } from '../prisma/prisma.service';
import { VehicleService } from '../vehicle/vehicle.service';
import { Errors } from '../shared/errors.service';

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

      // Calcular el total_pagar
      let total_pagar = 0;

      // Mapear los detalles para calcular el importe de cada producto
      const detallesConImporte = detalles.map((item) => {
        const importe = item.cantidad * item.precio_unitario; // Calcular el importe por producto
        total_pagar += importe; // Sumar el importe al total
        return {
          ...item,
          importe, // Añadir el campo de importe a cada detalle
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
            total_pagar, // Usamos el total calculado
            vehiculo: {
              connect: {
                id: vehicle.id,
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
        presupuesto: result,
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
        include: {
          vehiculo: true,
          detalles: true,
        },
      });
      return presupuestos;
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findPresupuestoById(id: string) {
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
    return presupuesto;
  }

  async findPresupuestoByPlaca(offset: string, placa: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    try {
      const presupuesto = await this.prisma.vehiculo.findMany({
        where: {
          placa: placa,
        },
        include: {
          presupuestos: {
            include: {
              detalles: true,
            },
          },
        },
        skip,
        take: limit,
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

        return presupuesto 
      });
      return {
        message: 'Presupuesto eliminado exitosamente',
        presupuesto: result,
      }
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
