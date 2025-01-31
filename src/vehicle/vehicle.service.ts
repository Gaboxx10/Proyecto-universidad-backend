import { Injectable, NotFoundException, HttpException } from '@nestjs/common';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { ClientService } from 'src/client/client.service';
import { Errors } from 'src/shared/errors.service';

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
                id: client.id,
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
      });
      return vehicles;
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
          cliente: true,
        },
      });

      if (!vehicle) {
        throw new NotFoundException('Vehiculo no encontrado');
      }

      return vehicle;
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

      return vehicle;
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
      });

      if (vehicles.length === 0) {
        throw new NotFoundException('Vehiculos no encontrados');
      }

      return vehicles;
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
          ],
        },
        skip,
        take: limit,
      });

      if (vehicles.length === 0) {
        const vehiclesByCI = await this.prisma.vehiculo.findMany({
          where: {
            cliente: {
              datos: {
                cedula_identidad: search,
              },
            },
          },
          skip,
          take: limit,
        });

        if (vehiclesByCI.length === 0) {
          throw new NotFoundException('Vehiculos no encontrados');
        }
        return vehiclesByCI;
      }

      return vehicles;
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async updateVehicle(id: string, updateVehicleDto: any) {
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

     if(!placa && !marca && !modelo && !color && !tipo && !año && !kilometraje && !estado && !cedula_cliente) {
      throw new HttpException('Debe proporcionar al menos un campo para actualizar', 400);
    }

    const vehicle = await this.prisma.vehiculo.findUnique({
      where: { id },
    });

    if (!vehicle) {
      throw new NotFoundException('Vehiculo no encontrado');
    }

    try {
      const result = await this.prisma.$transaction(async (prisma) => {

        let persona: any;
        if (cedula_cliente) {
          persona = await prisma.persona.findUnique({
            where: {
              cedula_identidad: cedula_cliente,
              tipo_persona: 'CLIENTE',
            },
            include: {
              cliente: true,
            },
          });

          if (!persona) {
            throw new NotFoundException('Cliente no encontrado');
          }

          console.log('Cliente encontrado:', persona);

          const updateVehicle = await prisma.vehiculo.update({
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
              cliente: {
                connect: {
                  id: persona.cliente.id,
                },
              }
            },
            include: {
              cliente: {
                include: {
                  datos: true,
                }
              }
            }
          });
          return updateVehicle;

        } else {
          const updateVehicle = await prisma.vehiculo.update({
            where: { id },
            data: {
              placa: placa.toUpperCase(),
              marca,
              modelo,
              color,
              tipo,
              año,
              kilometraje,
              estado
            },
            include: {
              cliente: {
                include: {
                  datos: true,
                }
              }
            }
          });
          return updateVehicle;
        }
      });
      return {
        message: 'Vehiculo actualizado correctamente',
        result,
      };
    } catch (error) {
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
        result,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
