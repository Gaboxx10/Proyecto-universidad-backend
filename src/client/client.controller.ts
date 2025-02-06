import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ClientService } from './client.service';
import { CreateClientDto } from './dto/create-client.dto';
import { UpdateClientDto } from './dto/update-client.dto';

@Controller('client')
export class ClientController {
  constructor(private readonly clientService: ClientService) {}

  @Post("/create-client")
  create(@Body() createClientDto: CreateClientDto) {
    return this.clientService.createClient(createClientDto);
  }

  @Get("/clients")
  findAllClients(@Query("offset")  offset : string) {
    return this.clientService.findAllClients(offset)
  }

  @Get('/clients/id/:id')
  findClientById(@Param("id") id: string) {
    return this.clientService.findClientById(id)
  }

  @Get('/clients/ci/:ci')
  findClientByCI(@Param("ci") ci: string) {
    return this.clientService.findClientByCI(ci)
  }
 
  @Get("/clients/search")
  searchClients(@Query("search") search: string, @Query("offset") offset: string) {
    return this.clientService.searchClient(search, offset)
  }

  @Patch('/clients/id/:id/update')
  updateClient(@Param("id") id: string, @Body() updateClientDto: UpdateClientDto) {
    return this.clientService.updateClient(id, updateClientDto)
  }

  @Delete("/clients/id/:id/delete")
  deleteClient(@Param("id") id: string) {
    return this.clientService.deleteClient(id)
  }
}
