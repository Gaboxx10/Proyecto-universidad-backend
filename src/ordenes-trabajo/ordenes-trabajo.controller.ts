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

  @Get("/ordenes")
  findAllOrdenes(@Query() offset: string) {
    return this.ordenesTrabajoService.findAllOrdenes(offset);
  }

  @Get('/ordenes/id/:id')
  findOrdenById(@Param('id') id: string) {
    return this.ordenesTrabajoService.findOrdenById(id);
  }


  @Delete('/ordenes/id/:id/delete')
  deleteOrden(@Param('id') id: string) {
    return this.ordenesTrabajoService.deleteOrden(id);
  }
}
