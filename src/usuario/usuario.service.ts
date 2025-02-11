import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/bcrypt.service';
import { Errors } from 'src/shared/errors.service';
import { Modules, Rol, TipoPersona } from 'src/constants/constants';

export enum UserRole {
  ASSISTANT = 'Asistente',
  ADMIN = 'Administrador',
  MECHANIC = 'Mecánico',
}

@Injectable()
export class UsuarioService {
  constructor(
    private prisma: PrismaService,
    private bcryptService: BcryptService,
    private errors: Errors,
  ) {}

  private entity = Modules.usuario;
  private tipo_persona = TipoPersona.USUARIO;

  async createUser(data: CreateUsuarioDto) {
    try {
      if (data.contraseña != data.confirm_contraseña) {
        return new HttpException('Las contraseñas no coinciden', 400);
      }

      const hashedPassword = await this.bcryptService.hashPassword(
        data.contraseña,
      );

      const result = await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.usuario.create({
          data: {
            user_name: data.user_name,
            contraseña: hashedPassword,
            rol: data.rol,
            datos: {
              create: {
                tipo_persona: this.tipo_persona,
                nombres: data.nombres,
                apellidos: data.apellidos,
                cedula_identidad: data.cedula_identidad,
                cedula_id_detalles: 'V-' + data.cedula_identidad,
                telefono: data.telefono,
                direccion: data.direccion,
                email: data.email,
              },
            },
          },
          include: {
            datos: true,
          },
        });
        return user;
      });
      return {
        message: 'Usuario creado correctamente',
        data: result,
        statusCode: 201,
      };
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
            nombres: 'asc',
          },
        },
      });

      if (!users || users.length === 0) {
        throw new NotFoundException('No se encontraron usuarios');
      }

      return {
        message: 'Usuarios encontrados correctamente',
        data: users,
        statusCode: 200,
      };
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
      return {
        message: 'Usuario encontrado correctamente',
        data: user,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findUserByCI(ci: string) {
    try {
      const user = await this.prisma.usuario.findFirst({
        where: {
          datos: {
            cedula_identidad: ci,
          },
        },
        include: {
          datos: true,
        },
      });

      if (!user) {
        return new NotFoundException('Usuario no encontrado');
      }

      return {
        message: 'Usuario encontrado correctamente',
        data: user,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async searchUser(search: string, offset: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    try {
      const users = await this.prisma.usuario.findMany({
        where: {
          OR: [
            {
              datos: {
                nombres: {
                  contains: search,
                },
              },
            },
            {
              datos: {
                apellidos: {
                  contains: search,
                },
              },
            },
            {
              datos: {
                cedula_identidad: {
                  contains: search,
                },
              },
            },
            {
              user_name: {
                contains: search,
              },
            },
          ],
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
        },
      });

      if (!users || users.length === 0) {
        throw new NotFoundException('No se encontraron usuarios');
      }

      return {
        message: 'Usuarios encontrados correctamente',
        data: users,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async findUserByName(name: string, offset: string) {
    const limit = 10;
    const page = parseInt(offset, 10) || 1;
    const skip = (page - 1) * limit;

    try {
      const users = await this.prisma.usuario.findMany({
        where: {
          OR: [
            {
              datos: {
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
                  {
                    cedula_identidad: {
                      contains: name,
                    },
                  },
                ],
              },
            },
            {
              user_name: {
                contains: name,
              },
            },
          ],
        },
        orderBy: {
          datos: {
            nombres: 'asc',
            apellidos: 'asc',
          },
        },
        skip,
        take: limit,
      });

      if (!users || users.length === 0) {
        throw new NotFoundException('No se encontraron usuarios');
      }

      return {
        message: 'Usuarios encontrados correctamente',
        data: users,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  async updateUser(id: string, updateUsuarioDto: UpdateUsuarioDto) {
    const {
      nombres,
      apellidos,
      email,
      cedula_identidad,
      telefono,
      direccion,
      user_name,
      rol,
    } = updateUsuarioDto;

    const user = await this.prisma.usuario.findUnique({
      where: { id },
    });

    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    if (user.rol === Rol.ADMIN) {
      throw new ForbiddenException(
        'No puedes modificar el rol del Administrador del sistema',
      );
    }

    let cedula_id_detalles;
    if (cedula_identidad) {
      cedula_id_detalles = 'V-' + cedula_identidad;
    }

    let { contraseña, confirm_contraseña } = updateUsuarioDto;

    let hashedPassword;

    if (contraseña && confirm_contraseña) {
      if (contraseña !== confirm_contraseña) {
        return new BadRequestException('Las contraseñas no coinciden');
      }
      hashedPassword = await this.bcryptService.hashPassword(contraseña);
      contraseña = hashedPassword;
    } else if (contraseña && !confirm_contraseña) {
      return new BadRequestException('Las contraseñas no coinciden');
    } else if (!contraseña && confirm_contraseña) {
      return new BadRequestException('Las contraseñas no coinciden');
    }

    try {
      const result = await this.prisma.$transaction(async (prisma) => {
        const user = await prisma.usuario.findUnique({
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

        const updatedUser = await prisma.usuario.update({
          where: {
            id,
          },
          data: {
            user_name,
            contraseña: hashedPassword,
            rol,
            datos: {
              update: {
                nombres,
                apellidos,
                cedula_identidad,
                cedula_id_detalles,
                telefono,
                email,
                direccion,
              },
            },
          },
        });

        const updateData = await prisma.usuario.findUnique({
          where: {
            id,
          },
          include: {
            datos: true,
          },
        });

        return updateData;
      });

      return {
        message: 'Usuario actualizado exitosamente',
        data: result,
        statusCode: 200,
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
          datos: true,
        },
      });

      if (!user) {
        return new NotFoundException('Usuario no encontrado');
      }

      if (user.rol === Rol.ADMIN) {
        return new ForbiddenException(
          'No puedes eliminar al Administrador del sistema.',
        );
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
        data: user,
        statusCode: 200,
      };
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
