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


const CLIENTE = 'CLIENTE';

@Injectable()
export class ClientService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly errors: Errors,
  ) {}

  private entity = 'cliente';
  private tipo_persona = "CLIENTE";

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
                cedula_identidad: cdiOrRIF,
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
      })
      return {
        message: 'Cliente creado exitosamente',
        data: result,
        statusCode: 201
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

  async findClientByName(name: string, offset: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;
    try {

       const clients = await this.prisma.cliente.findMany({
        where: {
          datos: {
            OR: [
              {
                nombres: {
                  contains: name,
                },
                apellidos: {
                  contains: name,
                },
                cedula_identidad: {
                  contains: name,
                }
              },
            ]
          },
        },
        skip,
        take: limit,
        include: {
          datos: true,
        },
        orderBy: {
          datos: {
            nombres: 'asc',
          },
        }
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
        const client = await prisma.cliente.findUnique({
          where: { id },
          include: {
            datos: true,
          },
        });

        if (!client) {
          throw new NotFoundException('Cliente no encontrado');
        }

        //TODO: CEDULAA Y TIPO CLIENTE

        const updatedClient = await prisma.cliente.update({
          where: { id },
          data: {
            datos: {
              update: {
                nombres,
                apellidos,
                cedula_identidad,
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
          datos: true
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
