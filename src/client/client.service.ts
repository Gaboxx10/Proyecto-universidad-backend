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
        const persona = await prisma.persona.create({
          data: {
            tipo_persona: CLIENTE,
            nombres,
            apellidos,
            cedula_identidad,
            cedula_id_detalles: cdiOrRIF,
            telefono,
            direccion,
            email,
          },
        });

        const client = await prisma.cliente.create({
          data: {
            tipo_cliente: tipoCliente,
            datos: {
              connect: {
                id: persona.id,
              },
            },
          },
        });

        const clientData = await prisma.cliente.findUnique({
          where: {
            id: client.id,
          },
          include: {
            datos: true,
          },
        });

        return clientData;
      });
      return result;
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

      return clients;
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
      return client;
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
      const clients = await this.prisma.persona.findMany({
        where: {
          AND: [
            {
              OR: [
                {
                  nombres: {
                    contains: name,
                  },
                },
                {
                  apellidos: {
                    contains: name,
                  },
                },
              ],
            },
            {
              tipo_persona: CLIENTE,
            },
          ],
        },
        include: {
          cliente: true,
        },
        skip,
        take: limit,
      });

      if (!clients || clients.length === 0) {
        const clientByCI = await this.findClientByCI(name);
        if (clientByCI) {
          return [clientByCI];
        }
        return new NotFoundException('Cliente no encontrado');
      }

      const clientsData = clients.map((client) => ({
        id: client.cliente.id,
        tipo_cliente: client.cliente.tipo_cliente,
        datos: {
          id: client.id,
          tipo_persona: client.tipo_persona,
          nombres: client.nombres,
          apellidos: client.apellidos,
          cedula_identidad: client.cedula_identidad,
          cedula_id_detalles: client.cedula_id_detalles,
          telefono: client.telefono,
          direccion: client.direccion,
          email: client.email,
        },
      }));
      return clientsData;
    } catch (error) {
      console.log(error);
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findClientByCI(ci: string) {
    try {
      const client = await this.prisma.persona.findUnique({
        where: { cedula_identidad: ci, tipo_persona: CLIENTE },
        include: {
          cliente: true,
        },
      });

      if (!client) {
        return new NotFoundException('Usuario no encontrado');
      }

      const clientData = {
        id: client.cliente.id,
        tipo_cliente: client.cliente.tipo_cliente,
        datos: {
          id: client.id,
          tipo_persona: client.tipo_persona,
          nombres: client.nombres,
          apellidos: client.apellidos,
          cedula_identidad: client.cedula_identidad,
          cedula_id_detalles: client.cedula_id_detalles,
          telefono: client.telefono,
          direccion: client.direccion,
          email: client.email,
        },
      };

      return clientData;
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
        });

        const clientData = await prisma.cliente.findUnique({
          where: { id },
          include: {
            datos: true,
          },
        });

        return clientData;
      });

      return {
        message: 'Cliente actualizado exitosamente',
        result,
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
          datos: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!client) {
        throw new NotFoundException('Cliente no encontrado');
      }

      const personaId = client.datos.id;

      const result = await this.prisma.$transaction(async (prisma) => {
        const persona = await prisma.persona.delete({
          where: { id: personaId },
        });

        return persona;
      });
      return {
        message: 'Cliente eliminado exitosamente',
        result,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
