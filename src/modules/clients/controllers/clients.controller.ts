import {
  Controller,
  Get,
  Delete,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientDTO } from '../dtos';
import { ClientsGettingService, ClientsGeneralService } from '../services';
import { ClientsUpdateBodyDTO } from '../dtos';
import {
  ClientsGettingRequestQueryDTO,
  ClientsGettingResponseBodyDTO,
} from '../dtos';
import { ClientEntity } from '@app/entities';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsGeneralService: ClientsGeneralService,
    private readonly clientsGettingService: ClientsGettingService,
  ) {}

  @Post()
  async create(@Body() body: ClientEntity): Promise<true> {
    await this.clientsGeneralService.create(body);
    return true;
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ClientsUpdateBodyDTO,
  ): Promise<true> {
    await this.clientsGeneralService.update(id, body);
    return true;
  }

  @Delete('/:id')
  async deleteById(@Param('id', ParseIntPipe) id: number): Promise<true> {
    await this.clientsGeneralService.deleteById(id);
    return true;
  }

  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<ClientDTO> {
    return this.clientsGettingService.getByIdOrFail(id);
  }

  @Get()
  async getList(
    @Query() query: ClientsGettingRequestQueryDTO,
  ): Promise<ClientsGettingResponseBodyDTO> {
    return this.clientsGettingService.getList(query);
  }
}
