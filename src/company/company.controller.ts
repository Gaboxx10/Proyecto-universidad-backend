import { Controller, Get, Body, Patch, Param } from '@nestjs/common';
import { CompanyService } from './company.service';
import { UpdateCompanyDto } from './dto/update-company.dto';

@Controller('company')
export class CompanyController {
  constructor(private readonly companyService: CompanyService) {}

  @Get('/info')
  findOne() {
    return this.companyService.findCompany();
  }

  @Patch('/info/update')
  update(@Param('id') id: string, @Body() updateCompanyDto: UpdateCompanyDto) {
    return this.companyService.updateInfo(updateCompanyDto);
  }

}
