import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';


@ApiTags('Usuario')
@Controller('usuario')
@UseGuards(JwtAuthGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @ApiOperation({ summary: 'Crear un nuevo usuario' })
  @Post("/create-user")
  create(@Body() data: CreateUsuarioDto) {
    return this.usuarioService.createUser(data);
  }

  @ApiOperation({ summary: "Traer una lista de usuarios" })
  @Get("/users")
  findAllUsers(@Query("offset") offset: string) { 
    return this.usuarioService.findAllUsers(offset); 
  }

  @ApiOperation({ summary: 'Traer un usuario por su ID' })
  @Get('/users/id/:id')
  findUserById(@Param('id') id: string) {
    return this.usuarioService.findUserById(id);
  }

  @ApiOperation({ summary: 'Traer un usuario por su Cedula de Identidad' })
  @Get('/users/ci/:ci')
  findUserByCI(@Param('ci') ci: string) {
    return this.usuarioService.findUserByCI(ci);
  }

  @ApiOperation({ summary: 'Traer un usuario por su nombre o apellido' })
  @Get('/users/name/:name')
  findUserByName(@Param('name') name: string) {
    return this.usuarioService.findUserByName(name);
  }

  @ApiOperation({ summary: 'Editar un usuario por su ID' })
  @Patch('/users/id/:id/update')
  updateClient(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.updateUser(id, updateUsuarioDto);
  }

  @ApiOperation({ summary: 'Elimina un usuario por su ID' })
  @Delete('/users/id/:id/delete')
  deleteUser(@Param('id') id: string) {
    return this.usuarioService.deleteUser(id);
  }
}
