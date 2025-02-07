import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { UsuarioService } from './usuario.service';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';

import { Rol } from 'src/constants/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles-auth.guard';

@Controller('usuario')
@UseGuards(JwtAuthGuard, RolesGuard)
export class UsuarioController {
  constructor(private readonly usuarioService: UsuarioService) {}

  @Post("/create-user")
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  create(@Body() data: CreateUsuarioDto) {
    return this.usuarioService.createUser(data);
  }

  @Get("/users")
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findAllUsers(@Query("offset") offset: string) { 
    return this.usuarioService.findAllUsers(offset); 
  }

  @Get('/users/id/:id')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findUserById(@Param('id') id: string) {
    return this.usuarioService.findUserById(id);
  }

  @Get("/users/search")
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  searchUser(@Query("search") search: string, @Query("offset") offset: string) {
    return this.usuarioService.searchUser(search, offset);
  }

  @Patch('/users/id/:id/update')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  updateClient(@Param('id') id: string, @Body() updateUsuarioDto: UpdateUsuarioDto) {
    return this.usuarioService.updateUser(id, updateUsuarioDto);
  }

  @Delete('/users/id/:id/delete')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  deleteUser(@Param('id') id: string) {
    return this.usuarioService.deleteUser(id);
  }

}
