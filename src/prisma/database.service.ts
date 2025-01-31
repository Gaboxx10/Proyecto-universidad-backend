import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(private prisma: PrismaService) {}

  async onModuleInit() {
    await this.prisma.$connect();
    await this.enableForeignKeys();
    console.log('Conexión a la base de datos establecida');
  }

  async enableForeignKeys() {
    await this.prisma.$executeRaw`PRAGMA foreign_keys = ON;`;
  }
}
