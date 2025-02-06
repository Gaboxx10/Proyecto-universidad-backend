import { Controller, Get, Post, Body, Patch, Param, Delete, Query, UseGuards } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';
import { JwtAuthGuard } from 'src/shared/guards/jwt-auth.guard';
import { Rol } from 'src/constants/constants';
import { Roles } from 'src/shared/decorators/roles.decorator';
import { RolesGuard } from 'src/shared/guards/roles-auth.guard';

@Controller('client')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post("/create-client")
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }

  @Get("/clients")
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findAllClients(@Query("offset")  offset : string) {
    return this.clientService.findAllClients(offset)
  }

  @Get('/clients/id/:id')
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  findClientById(@Param("id") id: string) {
    return this.clientService.findClientById(id)
  }

  @Get("/clients/search")
  @Roles(Rol.ADMIN, Rol.ASISTENTE, Rol.MECANICO)
  searchClients(@Query("search") search: string, @Query("offset") offset: string) {
    return this.clientService.searchClient(search, offset)
  }

  @Patch('/clients/id/:id/update')
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  updateClient(@Param("id") id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.updateClient(id, updateClientDto)
  }

  @Delete("/clients/id/:id/delete")
  @Roles(Rol.ADMIN, Rol.ASISTENTE)
  deleteClient(@Param("id") id: string) {
    return this.clientService.deleteClient(id)
  }
}
