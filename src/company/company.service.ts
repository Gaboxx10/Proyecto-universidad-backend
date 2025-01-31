import { Injectable } from '@nestjs/common';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class CompanyService {
  constructor(private prisma: PrismaService) {}

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
    try {
      const company = await this.prisma.empresa.update({
        where: {
          id: 1,
        },
        data: updateCompanyDto,
      });
      return company;
    } catch (error) {
      console.log(error);
    }
  }
}
