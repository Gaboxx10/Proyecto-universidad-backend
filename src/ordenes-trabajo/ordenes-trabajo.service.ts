import { Injectable, HttpException } from '@nestjs/common';
import { CreateOrdenesTrabajoDto } from './dto/create-ordenes-trabajo.dto';
import { UpdateOrdenesTrabajoDto } from './dto/update-ordenes-trabajo.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Errors } from 'src/shared/errors.service';

@Injectable()
export class OrdenesTrabajoService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly vehicleService: VehicleService,
    private readonly errors: Errors,
  ) {}

  private entity = 'orden-trabajo';

  async createOrden(createOrdenesTrabajoDto: CreateOrdenesTrabajoDto) {
    const { placa_vehiculo, f_entrega_estimada, nota_adicional, detalles } =
      createOrdenesTrabajoDto;

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const vehicle =
          await this.vehicleService.findVehicleByPlaca(placa_vehiculo);

        if (vehicle instanceof Error || !vehicle) {
          throw new Error('Vehículo no encontrado');
        }

        const lastOrden = await prisma.ordenTrabajo.findFirst({
          orderBy: {
            num_orden: 'desc',
          },
          select: {
            num_orden: true,
          },
        });

        const num_orden = lastOrden ? lastOrden.num_orden + 1 : 1;

        const orden = await prisma.ordenTrabajo.create({
          data: {
            f_entrega_estimada,
            nota_adicional,
            num_orden,
            vehiculo: {
              connect: {
                placa: placa_vehiculo,
              },
            },
            detalles: {
              create: detalles.map((detalle) => ({
                observacion: detalle.observacion,
                solucion: detalle.solucion,
                descripcion: detalle.descripcion,
                cantidad: detalle.cantidad,
              })),
            },
          },
          include: {
            detalles: true,
          },
        });

        return orden;
      });

      return {
        message: 'Orden de trabajo creada exitosamente',
        data: result,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findAllOrdenes(offset: string) {
    const limit = 10;
    const page = parseInt(offset) || 1;
    const skip = (page - 1) * limit;

    try {
      const ordenes = await this.prisma.ordenTrabajo.findMany({
        include: {
          detalles: true,
          vehiculo: true,
        },
      });
      if(ordenes.length === 0) {
        throw new Error('No hay ordenes de trabajo disponibles');
      }
      return ordenes
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  findOne(id: number) {
    return `This action returns a #${id} ordenesTrabajo`;
  }

  //update(id: number, updateOrdenesTrabajoDto: UpdateOrdenesTrabajoDto) {
   // return `This action updates a #${id} ordenesTrabajo`;
  //}

  remove(id: number) {
    return `This action removes a #${id} ordenesTrabajo`;
  }
}
