import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateDiagnosticoDto } from './dto/create-diagnostico.dto';
import { UpdateDiagnosticoDto } from './dto/update-diagnostico.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { VehicleService } from 'src/vehicle/vehicle.service';
import { Errors } from 'src/shared/errors.service';

@Injectable()
export class DiagnosticosService {
  constructor(
    private prisma: PrismaService,
    private vehicleService: VehicleService,
    private errors: Errors,
  ) {}

  private entity = 'diagnostico';

  async createDiagnostic(createDiagnosticoDto: CreateDiagnosticoDto) {
    const { placa_vehiculo, observaciones } = createDiagnosticoDto;

    const vehicle =
      await this.vehicleService.findVehicleByPlaca(placa_vehiculo);
    if (vehicle instanceof Error) {
      throw new NotFoundException(vehicle.message);
    }

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const lastDiagnostico = await prisma.diagnostico.findFirst({
          orderBy: {
            num_diagnostico: 'desc',
          },
          select: {
            num_diagnostico: true,
          },
        });

        const num_diagnostico = lastDiagnostico
          ? lastDiagnostico.num_diagnostico + 1
          : 1;

        const diagnostico = await prisma.diagnostico.create({
          data: {
            num_diagnostico,
            vehiculo: {
              connect: {
                id: vehicle.data.id,
              },
            },
            revisiones: {
              create: observaciones.map((obs) => ({
                observacion: obs.observacion,
                causa_prob: obs.causa_prob,
                solucion: obs.solucion,
                nota: obs.nota || '',
              })),
            },
          },
          include: {
            revisiones: true,
            vehiculo: true,
          },
        });
        return diagnostico;
      });

      return {
        message: 'Diagnostico creado correctamente',
        data: result,
        statusCode: 201,
      };

    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findAllDiagnostics(offset: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    try {
      const diagnosticos = await this.prisma.diagnostico.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          num_diagnostico: 'desc',
        },
        include: {
          revisiones: true,
        },
      });

      if (!diagnosticos || diagnosticos.length === 0) {
        throw new NotFoundException('No se encontraron diagnosticos');
      }
      return {
        message: 'Diagnosticos encontrados',
        data: diagnosticos,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findDiagnosticById(id: string) {
    try {
      const diagnostico = await this.prisma.diagnostico.findUnique({
        where: {
          id,
        },
        include: {
          revisiones: true,
          vehiculo: true,
        },
      });

      if (!diagnostico) {
        throw new NotFoundException('Diagnostico no encontrado');
      }
      return {
        message: 'Diagnostico encontrado',
        data: diagnostico,
        statusCode: 200,
      };

    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  //update(id: number, updateDiagnosticoDto: UpdateDiagnosticoDto) {
  //return `This action updates a #${id} diagnostico`;
  //}

  async findDiagnosticByVehicle(offset: string, placa: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    const placa_vehiculo = placa.toUpperCase();

    const vehicle =
      await this.vehicleService.findVehicleByPlaca(placa_vehiculo);
    if (vehicle instanceof Error) {
      throw new NotFoundException(vehicle);
    }

    try {
      const diagnosticos = await this.prisma.diagnostico.findMany({
        where: {
          vehiculo: {
            id: vehicle.data.id,
          },
        },
        orderBy: {
          num_diagnostico: 'desc',
        },
        skip,
        take: limit,
        include: {
          vehiculo: true,
          revisiones: true,
        }
      });

      if (!diagnosticos || diagnosticos.length === 0) {
        throw new NotFoundException('No se encontraron diagnosticos');
      }

      return {
        message: 'Diagnosticos encontrados',  
        data: diagnosticos,
        statusCode: 200,
      };

    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async deleteDiagnostic(id: string) {
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const diagnostico = await prisma.diagnostico.findUnique({
          where: {
            id,
          },
        });

        if (!diagnostico) {
          throw new NotFoundException('Diagnostico no encontrado');
        }

        const deleteDiagnostic = await prisma.diagnostico.delete({
          where: { id: id },
        });

        return {
          message: 'Diagnostico eliminado correctamente',
          result: diagnostico,
          statusCode: 200,
        };
        
      });
      return result;
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
