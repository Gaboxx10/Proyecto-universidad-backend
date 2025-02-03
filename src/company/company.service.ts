import { Injectable, HttpException } from '@nestjs/common';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Errors } from 'src/shared/errors.service';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private errors: Errors,
  ) {}

  private entity = 'empresa';

  async findCompany() {
    try {
      const company = await this.prisma.empresa.findUnique({
        where: {
          id: 1,
        },
      });
      return company;
    } catch (error) {
      console.log(error);
    }
  }

  async updateInfo(updateCompanyDto: UpdateCompanyDto) {

    const { nombre, direccion, telefono, rif, email } = updateCompanyDto;

    try {

      const company = await this.prisma.empresa.update({
        where: {
          id: 1,
        },
        data: {
          nombre: nombre || undefined,
          direccion: direccion || undefined,
          telefono: telefono || undefined,
          rif: rif || undefined,
          rif_detalles: "J-" + rif || undefined,
          email: updateCompanyDto.email || undefined,
        },
      });

      const updateData = await this.prisma.empresa.findUnique({
        where: {
          id: 1,
        },
      });

      return {
        message: 'Empresa actualizada correctamente',
        data: updateData,
        status: 200,
      }
      
    } catch (error) {
      const errorData = this.errors.handleError(error, this.entity);
      return new HttpException(errorData, errorData.status);
    }
  }
}
