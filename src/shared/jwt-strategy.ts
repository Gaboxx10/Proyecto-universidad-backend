import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtPayload } from 'src/shared/jwt.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private prismaService: PrismaService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'GABRIEL',
    });
  }

  async validate(payload: JwtPayload) {
    const user = await this.prismaService.usuario.findUnique({
      where: {
        id: payload.sub,
      },
      select: {
        id: true,
        user_name: true,
        rol: true,
      }
    });

    if (!user) {
      throw new UnauthorizedException('Invalid token');
    }

    return { userId: payload.sub, username: payload.username, rol: payload.rol };
  }
}
