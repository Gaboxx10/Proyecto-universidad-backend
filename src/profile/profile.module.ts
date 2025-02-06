import { Module } from '@nestjs/common';
import { ProfileService } from './profile.service';
import { ProfileController } from './profile.controller';
import { UsuarioService } from 'src/usuario/usuario.service';
import { Errors } from 'src/shared/errors.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { BcryptService } from 'src/shared/bcrypt.service';

@Module({
  controllers: [ProfileController],
  providers: [ProfileService, UsuarioService, Errors, PrismaService, BcryptService],
})
export class ProfileModule {}
