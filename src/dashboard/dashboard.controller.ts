import { Controller, Get, UseGuards } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { Rol } from 'src/constants/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles-auth.guard';

@Controller('dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Get('/')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findDashboardData() {
    return this.dashboardService.findAllCount();
  }
}
