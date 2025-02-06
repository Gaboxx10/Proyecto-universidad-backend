import {
  Injectable,
  NotFoundException,
  HttpException,
  BadRequestException,
} from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from 'src/client/client.service';
import { Errors } from 'src/shared/errors.service';

export enum VehicleStatus {
  REGISTERED = 'Registrado',
  IN_DIAGNOSIS = 'En Diagnóstico',
  IN_REPAIR = 'En Reparación',
  IN_MAINTENANCE = 'En Mantenimiento',
  WAITING = 'En Espera',
  REPAIRED = 'Reparado',
  NOT_REPAIRABLE = 'No Reparable',
  DELIVERED = 'Entregado',
}

@Injectable()
export class VehicleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly clientService: ClientService,
    private readonly errors: Errors,
  ) {}

  private entity = 'vehiculo';

  async createVehicle(createVehicleDto: CreateVehicleDto) {
    const {
      cedula_cliente,
      placa,
      marca,
      modelo,
      color,
      tipo,
      año,
      kilometraje,
      estado,
    } = createVehicleDto;

    try {
      const client = await this.clientService.findClientByCI(cedula_cliente);
      if (client instanceof Error) {
        throw new NotFoundException('Cliente no encontrado');
      }

      const result = await this.prisma.$transaction(async (prisma) => {
        const vehicle = await prisma.vehiculo.create({
          data: {
            placa: placa.toUpperCase(),
            marca,
            modelo,
            color,
            tipo,
            año,
            kilometraje,
            estado,
            cliente: {
              connect: {
                id: client.data.id,
              },
            },
          },
          include: {
            cliente: true,
          },
        });

        return vehicle;
      });

      return {
        message: 'Vehiculo creado exitosamente',
        data: result,
        statusCode: 201,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findAllVehicles(offset: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    try {
      const vehicles = await this.prisma.vehiculo.findMany({
        skip,
        take: limit,
        orderBy: {
          placa: 'asc',
        },
      });
      return {
        message: 'Vehiculos encontrados exitosamente',
        data: vehicles,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findVehicleById(id: string) {
    try {
      const vehicle = await this.prisma.vehiculo.findUnique({
        where: { id },
        include: {
          cliente: {
            include: {
              datos: true,
            },
          },
        },
      });

      if (!vehicle) {
        throw new NotFoundException('Vehiculo no encontrado');
      }

      return {
        message: 'Vehiculo encontrado exitosamente',
        data: vehicle,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findVehicleByPlaca(placa: string) {
    const placaUpper = placa.toUpperCase();
    placa = placaUpper;

    try {
      const vehicle = await this.prisma.vehiculo.findUnique({
        where: { placa },
        include: {
          cliente: true,
        },
      });

      if (!vehicle) {
        throw new NotFoundException('Vehiculo no encontrado');
      }

      return {
        message: 'Vehiculo encontrado exitosamente',
        data: vehicle,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findVehicleByMarca(marca: string) {
    try {
      const vehicles = await this.prisma.vehiculo.findMany({
        where: {
          marca: {
            contains: marca,
          },
        },
        orderBy: {
          created_at: 'desc',
        },
      });

      if (vehicles.length === 0) {
        throw new NotFoundException('Vehiculos no encontrados');
      }

      return {
        message: 'Vehiculos encontrados exitosamente',
        data: vehicles,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findVehicleBySearch(search: string, offset: string) {
    const limit = 10;
    const page = parseInt(offset) || 1;
    const skip = (page - 1) * limit;

    try {
      const vehicles = await this.prisma.vehiculo.findMany({
        where: {
          OR: [
            {
              placa: {
                contains: search,
              },
            },
            {
              marca: {
                contains: search,
              },
            },
            {
              cliente: {
                datos: {
                  cedula_identidad: {
                    contains: search,
                  },
                },
              },
            },
          ],
        },
        orderBy: {
          created_at: 'desc',
        },
        skip,
        take: limit,
      });

      if (vehicles.length === 0) {
        throw new NotFoundException('Vehiculos no encontrados');
      }

      return {
        message: 'Vehiculos encontrados exitosamente',
        data: vehicles,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async updateVehicle(id: string, updateVehicleDto: UpdateVehicleDto) {
    const {
      placa,
      marca,
      modelo,
      color,
      tipo,
      año,
      kilometraje,
      estado,
      cedula_cliente,
    } = updateVehicleDto;

    let clientId: string | undefined;

    const vehicle = await this.prisma.vehiculo.findUnique({
      where: { id },
      include: { cliente: true },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehiculo no encontrado');
    }

    if (cedula_cliente) {
      const client = await this.prisma.cliente.findFirst({
        where: { datos: { cedula_identidad: cedula_cliente } },
      });

      if (!client) {
        throw new NotFoundException('Cliente no encontrado');
      }

      if (vehicle.cliente?.id === client.id) {
        throw new BadRequestException(
          'El vehículo ya está asociado a este cliente',
        );
      }

      clientId = client.id;
    }

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        return await prisma.vehiculo.update({
          where: { id },
          data: {
            placa,
            marca,
            modelo,
            color,
            tipo,
            año,
            kilometraje,
            estado,
            cliente: clientId ? { connect: { id: clientId } } : undefined,
          },
        });
      });

      return {
        message: 'Vehículo actualizado correctamente',
        data: result,
        statusCode: 200,
      };
    } catch (error) {
      console.error('Error al actualizar vehículo:', error);
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async deleteVehicle(id: string) {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const vehicle = await prisma.vehiculo.findUnique({
          where: { id },
        });

        if (!vehicle) {
          throw new NotFoundException('Vehiculo no encontrado');
        }

        await prisma.vehiculo.delete({
          where: { id },
        });

        return vehicle;
      });

      return {
        message: 'Vehiculo eliminado correctamente',
        data: result,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async updateStatus(id: string, status: string) {
    try {
      const vehicle = await this.prisma.vehiculo.findUnique({
        where: { id },
      });

      if (!vehicle) {
        throw new NotFoundException('Vehiculo no encontrado');
      }

      const updatedVehicle = await this.prisma.vehiculo.update({
        where: { id },
        data: {
          estado: status,
        },
      });

      return {
        message: 'Estado del vehiculo actualizado correctamente',
        data: updatedVehicle,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
