import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ProveedoresService } from './proveedores.service';
import { CreateProveedoreDto } from './dto/create-proveedore.dto';
import { UpdateProveedoreDto } from './dto/update-proveedore.dto';

@Controller('providers')
export class ProveedoresController {
  constructor(private readonly proveedoresService: ProveedoresService) {}

  @Post("/create-provider")
  create(@Body() createProveedoreDto: any) {
    return this.proveedoresService.createProvider(createProveedoreDto);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    //return this.proveedoresService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProveedoreDto: UpdateProveedoreDto) {
    //return this.proveedoresService.update(+id, updateProveedoreDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    //return this.proveedoresService.remove(+id);
  }
}
