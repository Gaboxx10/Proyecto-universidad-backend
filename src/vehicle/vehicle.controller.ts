import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

import { Rol } from 'src/constants/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles-auth.guard';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

@Controller('vehicle')
@UseGuards(JwtAuthGuard, RolesGuard)
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post("/create-vehicle")
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.createVehicle(createVehicleDto);
  }

  @Get("/vehicles")
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findAllVehicles(@Query("offset") offset : string) {
    return this.vehicleService.findAllVehicles(offset);
  }

  @Get('/vehicles/id/:id')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findVehicleById(@Param('id') id: string) {
    return this.vehicleService.findVehicleById(id);
  }

  @Get('/vehicles/search/')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findVehicleBySearch(@Query('search') search: string, @Query("offset") offset: string ) {
    return this.vehicleService.searchVehicle(search, offset);
  }

  @Patch('/vehicles/id/:id/update')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  updateVehicle(@Param('id') id: string, @Body() updateVehicleDto: UpdateVehicleDto) {
    return this.vehicleService.updateVehicle(id, updateVehicleDto);
  }

  @Delete('/vehicles/id/:id/delete')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  deleteVehicle(@Param('id') id: string) {
    return this.vehicleService.deleteVehicle(id);
  }
}
