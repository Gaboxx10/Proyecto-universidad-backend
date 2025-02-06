import { Injectable, HttpException, NotFoundException } from '@nestjs/common';
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
          throw new NotFoundException('Vehículo no encontrado');
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
                id: vehicle.data.id,
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
            vehiculo: true,
          },
        });

        return orden;
      });

      return {
        message: 'Orden de trabajo creada exitosamente',
        data: result,
        status: 201,
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
        orderBy: {
          num_orden: 'desc',
        },
        skip,
        take: limit,
      });

      if (ordenes.length === 0) {
        throw new NotFoundException('No hay ordenes de trabajo disponibles');
      }
      return {
        message: 'Ordenes de trabajo encontradas',
        data: ordenes,
        status: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findOrdenById(id: string) {
    try {
      const orden = await this.prisma.ordenTrabajo.findUnique({
        where: {
          id,
        },
        include: {
          detalles: true,
          vehiculo: {
            include: {
              cliente: {
                include: {
                  datos: true,
                },
              },
            },
          },
        },
      });
      if (!orden) {
        throw new NotFoundException('Orden de trabajo no encontrada');
      }
      return {
        message: 'Orden de trabajo encontrada',
        data: orden,
        status: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findOrdersByVehicle(placa_vehiculo: string, offset: string) {
    const limit = 10;
    const page = parseInt(offset) || 1;
    const skip = (page - 1) * limit;

    try {
      const vehicle =
        await this.vehicleService.findVehicleByPlaca(placa_vehiculo);

      if (vehicle instanceof Error || !vehicle) {
        throw new NotFoundException('Vehículo no encontrado');
      }

      const ordenes = await this.prisma.ordenTrabajo.findMany({
        where: {
          vehiculo: {
            id: vehicle.data.id,
          },
        },
        include: {
          detalles: true,
          vehiculo: true,
        },
        orderBy: {
          num_orden: 'desc',
        },
        skip,
        take: limit,
      });

      if (!ordenes || ordenes.length === 0) {
        throw new NotFoundException('No se encontraron ordenes de trabajo');
      }

      return {
        message: 'Ordenes de trabajo encontradas',
        data: ordenes,
        status: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async searchOrden(search: string, offset: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    const placa_vehiculo = search.toUpperCase();
    let num_orden = parseInt(search);

    if (isNaN(num_orden)) {
      num_orden = undefined;
    }

    try {
      const orden = await this.prisma.ordenTrabajo.findMany({
        where: {
          OR: [
            {
              num_orden: {
                equals: num_orden,
              },
            },
            {
              vehiculo: {
                placa: placa_vehiculo,
              },
            }
          ],
        },
        include: {
          detalles: true,
          vehiculo: true,
        },
        skip,
        take: limit,
        orderBy: {
          num_orden: 'desc',
        },
      });

      if (!orden || orden.length === 0) {
        throw new NotFoundException('No se encontraron ordenes de trabajo');
      }

      return {
        message: 'Ordenes de trabajo encontradas',
        data: orden,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  //update(id: number, updateOrdenesTrabajoDto: UpdateOrdenesTrabajoDto) {
  // return `This action updates a #${id} ordenesTrabajo`;
  //}

  async deleteOrden(id: string) {
    try {
      const orden = await this.prisma.ordenTrabajo.findUnique({
        where: {
          id,
        },
      });

      if (!orden) {
        throw new NotFoundException('Orden de trabajo no encontrada');
      }
      await this.prisma.ordenTrabajo.delete({
        where: {
          id,
        },
      });

      return {
        message: 'Orden de trabajo eliminada exitosamente',
        data: orden,
        status: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async printOrden(id: string) {
    try {
      const orden = await this.prisma.ordenTrabajo.findUnique({
        where: {
          id,
        },
        include: {
          detalles: true,
          vehiculo: {
            include: {
              cliente: {
                include: {
                  datos: true,
                },
              },
            },
          },
        },
      });

      if (!orden) {
        throw new NotFoundException('Orden de trabajo no encontrada');
      }

      return {
        data: orden,
        docType: this.entity,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
