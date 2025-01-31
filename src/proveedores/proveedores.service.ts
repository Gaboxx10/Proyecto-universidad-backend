import { HttpException, Injectable } from '@nestjs/common';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Errors } from 'src/shared/errors.service';

@Injectable()
export class ProveedoresService {
  constructor(
    private prisma: PrismaService,
    private errors: Errors,
  ) {}

  private entity = 'proveedores';

  async createProvider(createProveedoreDto: any) {
    const { nombre, telefono, direccion, rif } = createProveedoreDto;

    try {
      const provider = await this.prisma.proveedores.create({
        data: {
          nombre,
          telefono,
          direccion,
          rif,
          rif_detalles: "J-" + rif || null,
        },
      });

      return {
        message: 'Proveedor creado exitosamente',
        data: provider,
        statusCode: 201,
      }
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }

  findAll() {
    return `This action returns all proveedores`;
  }

  findOne(id: number) {
    return `This action returns a #${id} proveedore`;
  }

  update(id: number, updateProveedoreDto: UpdateProveedoreDto) {
    return `This action updates a #${id} proveedore`;
  }

  remove(id: number) {
    return `This action removes a #${id} proveedore`;
  }
}
