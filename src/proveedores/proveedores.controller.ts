import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';

@Controller('provider')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post("/create-provider")
  create(@Body() createProveedoreDto: any) {
    return this.proveedoresService.createProvider(createProveedoreDto);
  }

  @Get('/providers')
  findAllProviders(@Query("offset") offset: string) {
    return this.proveedoresService.findAllProviders(offset)
  }


  @Get('/providers/id/:id')
  findProviderById(@Param('id') id: string) {
    return this.proveedoresService.findProviderById(id)
  }

  @Get('/providers/name/:name')
  findProviderByName(@Param('name') name: string, @Query("offset") offset: string) {
    return this.proveedoresService.findProviderByName(name, offset)
  }

  @Patch('/providers/id/:id/update')
  updateProvider(@Param('id') id: string, @Body() updateProveedoreDto: UpdateProveedoreDto) {
    return this.proveedoresService.updateProvider(id, updateProveedoreDto);
  }

  @Delete('/providers/id/:id/delete')
  deleteProvider(@Param('id') id: string) {
    return this.proveedoresService.deleteProvider(id);
  }
}
