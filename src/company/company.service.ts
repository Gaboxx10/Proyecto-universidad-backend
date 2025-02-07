import { Injectable, HttpException } from '@nestjs/common';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { Errors } from 'src/shared/errors.service';
import { Modules } from 'src/constants/constants';

@Injectable()
export class CompanyService {
  constructor(
    private prisma: PrismaService,
    private errors: Errors,
  ) {}

  private entity = Modules.empresa;

  async findCompany() {
    try {
      const company = await this.prisma.empresa.findFirst()
      return company;
    } catch (error) {
      console.log(error);
    }
  }

  async updateInfo(updateCompanyDto: UpdateCompanyDto) {

    const { nombre, direccion, telefono, rif, email, iva, razon_social, moneda } = updateCompanyDto;

    let rif_detalles;
    if (rif) {
      rif_detalles = "J-" + rif;
    }

    try {

      let ivaValue : number | undefined = undefined;
      if (iva) {
        ivaValue = iva / 100;
      }

      const company = await this.prisma.empresa.update({
        where: {
          id: 1,
        },
        data: {
          nombre,
          direccion,
          telefono,
          rif,
          rif_detalles,
          email,
          iva: ivaValue,
          razon_social,
          moneda
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
