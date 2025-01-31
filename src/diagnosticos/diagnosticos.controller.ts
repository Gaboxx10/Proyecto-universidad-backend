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
import { DiagnosticosService } from './diagnosticos.service';
import { CreateDiagnosticoDto } from './dto/create-diagnostico.dto';
import { UpdateDiagnosticoDto } from './dto/update-diagnostico.dto';

@Controller('diagnostic')
export class DiagnosticosController {
  constructor(private readonly diagnosticosService: DiagnosticosService) {}

  @Post('/create-diagnostic')
  createDiagnostico(@Body() createDiagnosticoDto: CreateDiagnosticoDto) {
    return this.diagnosticosService.createDiagnostic(createDiagnosticoDto);
  }

  @Get('/diagnostics')
  findAllDiagnosticos(@Query('offset') offset: string) {
    return this.diagnosticosService.findAllDiagnostics(offset);
  }

  @Get('/diagnostics/id/:id')
  findDiagnosticById(@Param('id') id: string) {
    return this.diagnosticosService.findDiagnosticById(id);
  }

  @Get('/diagnostics/id/:id')
  printDiagnostic(@Param('id') id: string) {
    return this.diagnosticosService.findDiagnosticById(id);
  }

  @Get('/diagnostics/vehicle/:placa')
  findDiagnosticsByVehicle(
    @Query('offset') offset: string,
    @Param('placa') placa: string,
  ) {
    return this.diagnosticosService.findDiagnosticByVehicle(offset, placa);
  }

  @Patch('/diagnostics/id/:id/update')
  update(
    @Param('id') id: string,
    @Body() updateDiagnosticoDto: UpdateDiagnosticoDto,
  ) {
    //return this.diagnosticosService.update(+id, updateDiagnosticoDto);
  }

  @Delete('/diagnostics/id/:id/delete')
  remove(@Param('id') id: string) {
    return this.diagnosticosService.deleteDiagnostic(id);
  }
}
