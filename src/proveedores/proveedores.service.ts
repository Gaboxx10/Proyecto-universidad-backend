import {
  HttpException,
  Injectable,
  NotFoundException,
  Query,
} from '@nestjs/common';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Errors } from 'src/shared/errors.service';


@Injectable()
export class ProveedoresService {
  constructor(
    private prisma: PrismaService,
    private errors: Errors,
  ) {}

  private entity = 'proveedores';

  async createProvider(createProveedoreDto: any) {
    const { nombre, telefono, direccion, rif } = createProveedoreDto;

    try {
      const provider = await this.prisma.proveedores.create({
        data: {
          nombre,
          telefono,
          direccion,
          rif,
          rif_detalles: 'J-' + rif || null,
        },
      });

      return {
        message: 'Proveedor creado exitosamente',
        data: provider,
        statusCode: 201,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findAllProviders(offset: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    try {
      const providers = await this.prisma.proveedores.findMany({
        skip,
        take: limit,
        orderBy: {
          nombre: 'asc',
        },
      });

      if (providers.length === 0) {
        throw new NotFoundException('Proveedores no encontrados');
      }

      return {
        message: 'Proveedores encontrados',
        data: providers,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findProviderById(id: string) {
    try {
      const provider = await this.prisma.proveedores.findUnique({
        where: {
          id: id,
        },
      });

      if (!provider) {
        throw new NotFoundException('Proveedor no encontrado');
      }

      return {
        message: 'Proveedor encontrado',
        data: provider,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findProviderByName(name: string) {
    try {
      const providers = await this.prisma.proveedores.findMany({
        where: {
          nombre: {
            contains: name,
          }
        },
      });

      if (!providers.length || providers.length === 0) {
        throw new NotFoundException('Proveedor no encontrado');
      }

      return {
        message: 'Proveedor encontrado',
        data: providers,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async updateProvider(id: string, updateProveedoreDto: UpdateProveedoreDto) {
     const { nombre, telefono, direccion, nota, rif } = updateProveedoreDto

    try {
      const provider = await this.prisma.proveedores.findUnique({
        where: {
          id: id
        }
      })

      const updateProvider = await this.prisma.proveedores.update({
        where: {
          id: id
        },
        data: {
          nombre,
          telefono,
          rif,
          rif_detalles: "J-" + rif || undefined,
          direccion,
          nota
        }
      })

      return {
        message: 'Proveedor actualizado correctamente',
        data: updateProvider,
        statusCode: 200
      }

    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async deleteProvider(id: string) {
    try {
      const provider = await this.prisma.proveedores.findUnique({
        where: {
          id: id,
        },
      });

      if (!provider) {
        throw new NotFoundException('Proveedor no encontrado');
      }

      const deleted = await this.prisma.proveedores.delete({
        where: {
          id: id,
        },
      });

      return {
        message: 'Proveedor eliminado correctamente',
        data: provider,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
