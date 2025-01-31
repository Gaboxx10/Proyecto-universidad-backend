import { Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { DatabaseService } from './database.service';
import { SeedService } from './seed/seed.service';

@Module({
  providers: [PrismaService, DatabaseService, SeedService],
  exports: [PrismaService, SeedService]
})
export class PrismaModule {}
