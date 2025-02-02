import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { defaultData } from './default.data';
import { BcryptService } from 'src/shared/bcrypt.service';

@Injectable()
export class SeedService {
  constructor(private readonly prisma: PrismaService, private readonly bcryptService: BcryptService) {}

  async seed() {
    const seedStatus = await this.prisma.seedStatus.findUnique({
      where: { name: 'initial-seed' }, 
    });

    if (seedStatus?.executed) {
      return; 
    }

    const hashedPassword = await this.bcryptService.hashPassword(defaultData.user.password);

    const persona = await this.prisma.persona.create({
      data: {
        nombres: defaultData.user.nombres,
        apellidos: defaultData.user.apellidos,
        email: defaultData.user.email,
        cedula_identidad: defaultData.user.cedula_identidad,
        telefono: defaultData.user.telefono,
        direccion: defaultData.user.direccion,
        tipo_persona: defaultData.user.tipo_persona,
        usuario: {
          create: {
            user_name: defaultData.user.user_name,
            contraseña: hashedPassword,
            rol: defaultData.user.role,
          },
        }
      },
    });

    const empresa = await this.prisma.empresa.create({
      data: {
        nombre: defaultData.empresa.nombre,
        direccion: defaultData.empresa.direccion,
        telefono: defaultData.empresa.telefono,
        email: defaultData.empresa.email,
        rif: defaultData.empresa.rif,
        rif_detalles: defaultData.empresa.rif_detalles
      },
    }); 

    await this.prisma.seedStatus.upsert({
      where: { name: 'initial-seed' },
      update: { executed: true },  
      create: { name: 'initial-seed', executed: true }, 
    });

}}
