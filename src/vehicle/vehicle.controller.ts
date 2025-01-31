import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { CreateVehicleDto } from './dto/create-vehicle.dto';
import { UpdateVehicleDto } from './dto/update-vehicle.dto';

@Controller('vehicle')
export class VehicleController {
  constructor(private readonly vehicleService: VehicleService) {}

  @Post("/create-vehicle")
  createVehicle(@Body() createVehicleDto: CreateVehicleDto) {
    return this.vehicleService.createVehicle(createVehicleDto);
  }

  @Get("/vehicles")
  findAllVehicles(@Query("offset") offset : string) {
    return this.vehicleService.findAllVehicles(offset);
  }

  @Get('/vehicles/id/:id')
  findVehicleById(@Param('id') id: string) {
    return this.vehicleService.findVehicleById(id);
  }

  @Get('/vehicles/placa/:placa')
  findVehicleByPlaca(@Param('placa') placa: string) {
    return this.vehicleService.findVehicleByPlaca(placa);
  }

  @Get('/vehicles/marca/:marca') //TODO: PAGINACION
  findVehicleByMarca(@Param('marca') marca: string) {
    return this.vehicleService.findVehicleByMarca(marca);
  }

  @Get('/vehicles/search/:search')
  findVehicleBySearch(@Param('search') search: string, @Query("offset") offset: string ) {
    return this.vehicleService.findVehicleBySearch(search, offset);
  }

  @Patch('/vehicles/id/:id/update')
  updateVehicle(@Param('id') id: string, @Body() updateVehicleDto: any) {
    return this.vehicleService.updateVehicle(id, updateVehicleDto);
  }

  @Delete('/vehicles/id/:id/delete')
  deleteVehicle(@Param('id') id: string) {
    return this.vehicleService.deleteVehicle(id);
  }
}
