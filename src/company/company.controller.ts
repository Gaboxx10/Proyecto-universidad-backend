import { Controller, Get, Body, Patch, Param, UseGuards } from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { Rol } from 'src/constants/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles-auth.guard';

@Controller('company')
@UseGuards(JwtAuthGuard, RolesGuard)
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/info')
  @Roles(Rol.ADMIN)
  findOCompanyInfo() {
    return this.companyService.findCompany();
  }

  @Patch('/info/update')
  @Roles(Rol.ADMIN)
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.updateInfo(updateCompanyDto);
  }
}
