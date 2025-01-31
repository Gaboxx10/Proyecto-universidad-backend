import { Module } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { UsuarioController } from './usuario.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedModule } from 'src/shared/shared.module';
import { Errors } from 'src/shared/errors.service';

@Module({
  imports: [SharedModule],
  controllers: [UsuarioController],
  providers: [UsuarioService, PrismaService, Errors],
})
export class UsuarioModule {}
