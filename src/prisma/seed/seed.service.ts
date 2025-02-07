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
    const hashedPasswordAux = await this.bcryptService.hashPassword(defaultData.aux.password);

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

    const aux = await this.prisma.persona.create({
      data: {
        nombres: defaultData.aux.nombres,
        apellidos: defaultData.aux.apellidos,
        email: defaultData.aux.email,
        cedula_identidad: defaultData.aux.cedula_identidad,
        telefono: defaultData.aux.telefono,
        direccion: defaultData.aux.direccion,
        tipo_persona: defaultData.aux.tipo_persona,
        usuario: {
          create: {
            user_name: defaultData.aux.user_name,
            contraseña: hashedPasswordAux,
            rol: defaultData.aux.role,
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
