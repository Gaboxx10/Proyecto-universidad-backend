import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DatabaseService } from './database.service';
import { SeedService } from './seed/seed.service';
import { BcryptService } from 'src/shared/bcrypt.service';

@Module({
  providers: [PrismaService, DatabaseService, SeedService, BcryptService],
  exports: [PrismaService, SeedService]
})
export class PrismaModule {}
