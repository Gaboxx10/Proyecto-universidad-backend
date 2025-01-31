import { HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/bcrypt.service';
import { Errors } from 'src/shared/errors.service';

@Injectable()
export class UsuarioService {
  constructor(
    private prisma: PrismaService,
    private bcryptService: BcryptService,
    private errors: Errors,
  ) {}

  private entity = 'usuario';

  async createUser(data: CreateUsuarioDto) {
    try {
      if (data.contraseña != data.confirm_contraseña) {
        return new HttpException('Las contraseñas no coinciden', 400);
      }

      const hashedPassword = await this.bcryptService.hashPassword(
        data.contraseña,
      );

      const result = await this.prisma.$transaction(async (prisma) => {
        const persona = await prisma.persona.create({
          data: {
            nombres: data.nombres,
            apellidos: data.apellidos,
            cedula_identidad: data.cedula_identidad,
            cedula_id_detalles: 'V-' + data.cedula_identidad,
            telefono: data.telefono,
            email: data.email,
            direccion: data.direccion,
            tipo_persona: 'USUARIO',
          },
        });

        const usuario = await prisma.usuario.create({
          data: {
            user_name: data.user_name,
            contraseña: hashedPassword,
            rol: data.rol,
            datos: {
              connect: {
                id: persona.id,
              },
            },
          },
        });
        const usuarioWithData = await prisma.usuario.findUnique({
          where: {
            id: usuario.id,
          },
          include: {
            datos: true,
          },
        });

        return {
          usuarioWithData,
        };
      });
      return result;
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findAllUsers(offset: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    try {
      const users = await this.prisma.usuario.findMany({
        skip,
        take: limit,
        include: {
          datos: true,
        },
        orderBy: {
          datos: {
            cedula_identidad: 'asc',
          },
        },
      });

      if (!users || users.length === 0) {
        throw new NotFoundException('No se encontraron usuarios');
      }

      return users;
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findUserById(id: string) {
    try {
      const user = await this.prisma.usuario.findUnique({
        where: { id },
        include: {
          datos: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }
      return user;
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findUserByCI(ci: string) {
    try {
      const user = await this.prisma.persona.findUnique({
        where: { cedula_identidad: ci, tipo_persona: 'Usuario' },
        include: {
          usuario: true,
        },
      });

      if (!user) {
        return new NotFoundException('Usuario no encontrado');
      }

      const userData = {
        id: user.id,
        nombres: user.nombres,
        apellidos: user.apellidos,
        cedula_identidad: user.cedula_identidad,
        telefono: user.telefono,
        email: user.email,
        direccion: user.direccion,
        user_name: user.usuario.user_name,
        rol: user.usuario.rol,
      };

      return userData;
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findUserByName(name: string) {
    try {
      const users = await this.prisma.persona.findMany({
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
              tipo_persona: 'USUARIO',
            },
          ],
        },
        include: {
          usuario: true,
        },
      });

      if (!users || users.length === 0) {
        const userByCI = await this.findUserByCI(name);
        console.log('Usuario encontrado por CI:', userByCI);
        if (userByCI) {
          return userByCI;
        }
        return new NotFoundException('Usuario no encontrado');
      }

      const userData = users.map((user) => ({
        id: user.id,
        user_name: user.usuario.user_name,
        rol: user.usuario.rol,
        datos: {
          nombres: user.nombres,
          apellidos: user.apellidos,
          cedula_identidad: user.cedula_identidad,
          telefono: user.telefono,
          email: user.email,
          direccion: user.direccion,
        },
      }));

      return userData;
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async updateUser(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    //TODO: VALIDACIONES Y HACER CAMBIO DE CONTRASEÑA E EMAIL
    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const user = await this.prisma.usuario.findUnique({
          where: {
            id,
          },
          include: {
            datos: true,
          },
        });

        if (!user) {
          return new NotFoundException('Usuario no encontrado');
        }

        const updatedUser = await this.prisma.usuario.update({
          where: {
            id,
          },
          data: {
            user_name: updateUsuarioDto.user_name,
            contraseña: updateUsuarioDto.contraseña,
            datos: {
              update: {
                nombres: updateUsuarioDto.nombres,
                apellidos: updateUsuarioDto.apellidos,
                cedula_identidad: updateUsuarioDto.cedula_identidad,
                telefono: updateUsuarioDto.telefono,
                email: updateUsuarioDto.email,
                direccion: updateUsuarioDto.direccion,
              },
            },
          },
        });

        const updatedUserWithData = await this.prisma.usuario.findUnique({
          where: {
            id,
          },
          include: {
            datos: {
              select: {
                id: true,
              },
            },
          },
        });
        return updatedUserWithData;
      });
      return {
        message: 'Usuario actualizado exitosamente',
        result,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async deleteUser(id: string) {
    try {
      const user = await this.prisma.usuario.findUnique({
        where: {
          id,
        },
        include: {
          datos: {
            select: {
              id: true,
            },
          },
        },
      });

      if (!user) {
        return new NotFoundException('Usuario no encontrado');
      }

      const personaId = user.datos.id;

      const result = await this.prisma.$transaction(async (prisma) => {
        const deleted = await prisma.persona.delete({
          where: {
            id: personaId,
          },
        });

        return deleted;
      });
      return {
        message: 'Usuario eliminado exitosamente',
        result,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
