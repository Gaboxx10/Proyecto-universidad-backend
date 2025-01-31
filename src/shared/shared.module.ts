import { Module } from '@nestjs/common';
import { BcryptService } from './bcrypt.service';
import { JwtService } from './jwt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt-strategy';
import { PrismaService } from 'src/prisma/prisma.service';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { Errors } from './errors.service';

@Module({
  imports: [
    JwtModule.register({
      secret: 'GABRIEL',
      signOptions: { expiresIn: '1d' },
    }),
  ],
  providers: [BcryptService, JwtService, JwtStrategy, PrismaService, JwtAuthGuard, Errors],
  exports: [BcryptService, JwtService, JwtAuthGuard, Errors],
})
export class SharedModule {}
