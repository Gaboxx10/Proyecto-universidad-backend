import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/bcrypt.service';
import {
  JwtService as JwtServiceHelper,
  JwtPayload,
} from 'src/shared/jwt.service';

interface login {
  id: string;
  user_name: string;
  contraseña: string;
  rol: string;
}

@Injectable()
export class AuthService {
  constructor(
    private prismaService: PrismaService,
    private bcryptService: BcryptService,
    private jwtServiceHelper: JwtServiceHelper,
  ) {}

  async login(user: login) {
    const payload: JwtPayload = {
      sub: user.id,
      username: user.user_name,
      rol: user.rol,
    };

    try {
      const token = await this.jwtServiceHelper.generateAccessToken(payload);
      return {
        token,
      };
    } catch (error) {
      throw new HttpException(
        {
          message: error.message || 'Error al generar el token',
        },
        error.status || 500,
      );
    }
  }

  async validateUser(user_name: string, password: string) {
    try {
      const user = await this.prismaService.usuario.findUnique({
        where: {
          user_name,
        },
        select: {
          id: true,
          user_name: true,
          contraseña: true,
          rol: true,
        },
      });

      if (!user) {
        throw new NotFoundException('Usuario no encontrado');
      }

      const isPasswordValid = await this.bcryptService.comparePasswords(
        password,
        user.contraseña,
      );

      if (!isPasswordValid) {
        throw new UnauthorizedException('Contraseña incorrecta');
      }

      return user;
    } catch (error) {
      throw new HttpException(
        error.message || 'Error al validar el usuario',
        error.status || 500,
      );
    }
  }
}
