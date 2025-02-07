import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';

import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { Rol } from 'src/constants/constants';
import { RolesGuard } from 'src/shared/guards/roles-auth.guard';

@Controller('provider')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post("/create-provider")
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  create(@Body() createProveedoreDto: CreateProveedoreDto) {
    return this.proveedoresService.createProvider(createProveedoreDto);
  }

  @Get('/providers')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findAllProviders(@Query("offset") offset: string) {
    return this.proveedoresService.findAllProviders(offset)
  }

  @Get('/providers/id/:id')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findProviderById(@Param('id') id: string) {
    return this.proveedoresService.findProviderById(id)
  }

  @Get('/providers/search')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  searchProviders(@Query('search') search: string , @Query("offset") offset: string) {
    return this.proveedoresService.searchProviders(search, offset)
  }

  @Patch('/providers/id/:id/update')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  updateProvider(@Param('id') id: string, @Body() updateProveedoreDto: UpdateProveedoreDto) {
    return this.proveedoresService.updateProvider(id, updateProveedoreDto);
  }

  @Delete('/providers/id/:id/delete')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  deleteProvider(@Param('id') id: string) {
    return this.proveedoresService.deleteProvider(id);
  }
}
