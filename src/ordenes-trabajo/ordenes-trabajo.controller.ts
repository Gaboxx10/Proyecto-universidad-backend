import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { OrdenesTrabajoService } from './ordenes-trabajo.service';
import { CreateOrdenesTrabajoDto } from './dto/create-ordenes-trabajo.dto';
import { UpdateOrdenesTrabajoDto } from './dto/update-ordenes-trabajo.dto';

@Controller('ordenes-trabajo')
export class OrdenesTrabajoController {
  constructor(private readonly ordenesTrabajoService: OrdenesTrabajoService) {}

  @Post("/create-orden")
  create(@Body() createOrdenesTrabajoDto: CreateOrdenesTrabajoDto) {
    return this.ordenesTrabajoService.createOrden(createOrdenesTrabajoDto);
  }

  @Get("/all-ordenes")
  findAllOrdenes(@Query() offset: string) {
    return this.ordenesTrabajoService.findAllOrdenes(offset);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.ordenesTrabajoService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateOrdenesTrabajoDto: UpdateOrdenesTrabajoDto) {
    //return this.ordenesTrabajoService.update(+id, updateOrdenesTrabajoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.ordenesTrabajoService.remove(+id);
  }
}
