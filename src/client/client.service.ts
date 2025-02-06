import {
  HttpException,
  Injectable,
  NotFoundException,
  Query,
  BadRequestException,
} from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Errors } from 'src/shared/errors.service';

@Injectable()
export class ClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly errors: Errors,
  ) {}

  private entity = 'cliente';
  private tipo_persona = 'CLIENTE';

  async createClient(createClientDto: CreateClientDto) {
    const {
      tipo_cliente,
      nombres,
      apellidos,
      cedula_identidad,
      telefono,
      direccion,
      email,
    } = createClientDto;

    let cdiOrRIF: string;
    const tipoCliente = tipo_cliente.toUpperCase();
    if (tipoCliente === 'PERSONA_NATURAL') {
      cdiOrRIF = 'V-' + cedula_identidad;
    } else if (tipoCliente === 'EMPRESA') {
      cdiOrRIF = 'J-' + cedula_identidad;
    } else {
      throw new HttpException('Tipo de cliente no valido', 400);
    }

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const client = await prisma.cliente.create({
          data: {
            tipo_cliente: tipoCliente,
            datos: {
              create: {
                tipo_persona: this.tipo_persona,
                nombres,
                apellidos,
                cedula_identidad,
                cedula_id_detalles: cdiOrRIF,
                telefono,
                direccion,
                email,
              },
            },
          },
          include: {
            datos: true,
          },
        });
        return client;
      });
      return {
        message: 'Cliente creado exitosamente',
        data: result,
        statusCode: 201,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findAllClients(offset: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    try {
      const clients = await this.prisma.cliente.findMany({
        skip,
        take: limit,
        include: {
          datos: true,
        },
        orderBy: {
          datos: {
            nombres: 'asc',
          },
        },
      });

      if (!clients || clients.length === 0) {
        throw new HttpException('No se encontraron clientes', 404);
      }

      return {
        message: 'Clientes encontrados exitosamente',
        data: clients,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findClientById(id: string) {
    try {
      const client = await this.prisma.cliente.findUnique({
        where: { id },
        include: {
          datos: true,
          //vehiculos: true,
        },
      });

      if (!client) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return {
        message: 'Cliente encontrado exitosamente',
        data: client,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async searchClient(search: string, offset: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    const searchTerm = search;

    try {
      const client = await this.prisma.cliente.findMany({
        where: {
          datos: {
            OR: [
              {
                cedula_identidad: {
                  contains: searchTerm,
                },
              },
              {
                nombres: {
                  contains: searchTerm,
                },
              },
              {
                apellidos: {
                  contains: searchTerm,
                },
              }]
          } 
        },
        include: {
          datos: true,
        },
        skip,
        take: limit,
        orderBy: {
          datos: {
            nombres: 'asc',
          },
        },
      });

      if (!client || client.length === 0) {
        throw new NotFoundException('No se encontraron clientes');
      }

      return {
        message: 'Clientes encontrados',
        data: client,
        statusCode: 200,
      };
    } catch (error) {
      console.log(error);
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findClientByCI(ci: string) {
    try {
      const client = await this.prisma.cliente.findFirst({
        where: {
          datos: {
            cedula_identidad: ci,
          },
        },
        include: {
          datos: true,
        },
      });

      if (!client) {
        return new NotFoundException('Usuario no encontrado');
      }

      return {
        message: 'Cliente encontrado exitosamente',
        data: client,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async updateClient(id: string, updateClientDto: UpdateClientDto) {
    const { nombres, apellidos, cedula_identidad, telefono, direccion, email } =
      updateClientDto;

    const validateObject =
      nombres ||
      apellidos ||
      cedula_identidad ||
      telefono ||
      direccion ||
      email;

    if (!validateObject) {
      throw new BadRequestException(
        'Debe proporcionar al menos un campo para actualizar',
      );
    }

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        // Buscar cliente
        const client = await prisma.cliente.findUnique({
          where: { id },
          include: { datos: true },
        });

        if (!client) {
          throw new NotFoundException('Cliente no encontrado');
        }

        // Validar si la cédula ya está registrada
        if (cedula_identidad) {
          const existingClient = await prisma.cliente.findFirst({
            where: { datos: { cedula_identidad } },
          });

          if (existingClient) {
            throw new BadRequestException('Esta cédula ya está registrada');
          }
        }

        // Actualización del cliente
        const updatedClient = await prisma.cliente.update({
          where: { id },
          data: {
            datos: {
              update: {
                nombres,
                apellidos,
                telefono,
                direccion,
                email,
                cedula_identidad: cedula_identidad
                  ? cedula_identidad
                  : undefined,
                cedula_id_detalles: cedula_identidad
                  ? 'V-' + cedula_identidad
                  : undefined,
              },
            },
          },
          include: { datos: true },
        });

        return updatedClient;
      });

      return {
        message: 'Cliente actualizado exitosamente',
        data: result,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async deleteClient(id: string) {
    try {
      const client = await this.prisma.cliente.findUnique({
        where: { id },
        include: {
          datos: true,
        },
      });

      if (!client) {
        throw new NotFoundException('Cliente no encontrado');
      }

      const personaId = client.datos.id;

      const result = await this.prisma.$transaction(async (prisma) => {
        const deleted = await prisma.persona.delete({
          where: { id: personaId },
        });

        return deleted;
      });
      return {
        message: 'Cliente eliminado exitosamente',
        data: client,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
