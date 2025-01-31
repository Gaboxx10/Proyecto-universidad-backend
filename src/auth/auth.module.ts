import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { SharedModule } from 'src/shared/shared.module';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { LocalStrategy } from './local-strategy';


@Module({
  imports: [
    SharedModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, LocalStrategy, PrismaService, LocalAuthGuard],
})
export class AuthModule {}
