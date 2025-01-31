import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
} from '@nestjs/common';
import { PresupuestoService } from './presupuesto.service';
import { CreatePresupuestoDto } from './dto/create-presupuesto.dto';
import { UpdatePresupuestoDto } from './dto/update-presupuesto.dto';
import { of } from 'rxjs';
import { off } from 'process';

@Controller('presupuesto')
export class PresupuestoController {
  constructor(private readonly presupuestoService: PresupuestoService) {}

  @Post('/create-presupuesto')
  createPresupuesto(@Body() createPresupuestoDto: CreatePresupuestoDto) {
    return this.presupuestoService.createPresupuesto(createPresupuestoDto);
  }

  @Get('/presupuestos')
  findAllPresupuestos(@Query('offset') offset: number) {
    return this.presupuestoService.findAllPresupuestos(offset);
  }

  @Get('/presupuestos/id/:id')
  findPresupuestoById(@Param('id') id: string) {
    return this.presupuestoService.findPresupuestoById(id);
  }

  @Get('/presupuestos/placa/:placa')
  findPresupuestoByPlaca(
    @Query('offset') offset: string,
    @Param('placa') placa: string,
  ) {
    return this.presupuestoService.findPresupuestoByPlaca(offset, placa);
  }

  @Patch('/presupuestos/id/:id/update')
  updatePresupuesto(
    @Param('id') id: string,
    @Body() updatePresupuestoDto: UpdatePresupuestoDto,
  ) {
    //return this.presupuestoService.update(+id, updatePresupuestoDto);
  }

  @Delete('/presupuestos/id/:id/delete')
  deletePresupuesto(@Param('id') id: string) {
    return this.presupuestoService.deletePresupuesto(id);
  }
}
