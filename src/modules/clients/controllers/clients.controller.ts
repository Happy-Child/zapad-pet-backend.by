import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientDTO, ClientsCreateBodyDTO } from '../dtos';
import { ClientsGettingService, ClientsService } from '../services';
import { ClientsUpdateBodyDTO } from '../dtos';
import {
  ClientsGettingRequestQueryDTO,
  ClientsGettingResponseBodyDTO,
} from '../dtos';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsService: ClientsService,
    private readonly clientsGettingService: ClientsGettingService,
  ) {}

  @Post()
  async create(@Body() body: ClientsCreateBodyDTO): Promise<true> {
    await this.clientsService.create(body);
    return true;
  }

  @Patch('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ClientsUpdateBodyDTO,
  ): Promise<true> {
    await this.clientsService.update(id, body);
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
