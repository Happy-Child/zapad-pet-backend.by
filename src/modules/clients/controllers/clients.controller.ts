import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { ClientDTO } from '../dtos';
import {
  ClientsGettingService,
  ClientsCreateService,
  ClientsUpdateService,
} from '../services';
import { ClientsUpdateBodyDTO } from '../dtos';
import {
  ClientsGettingRequestQueryDTO,
  ClientsGettingResponseBodyDTO,
} from '../dtos';
import { ClientEntity } from '@app/entities';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsCreateService: ClientsCreateService,
    private readonly clientsUpdateService: ClientsUpdateService,
    private readonly clientsGettingService: ClientsGettingService,
  ) {}

  @Post()
  async create(@Body() body: ClientEntity): Promise<true> {
    await this.clientsCreateService.create(body);
    return true;
  }

  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ClientsUpdateBodyDTO,
  ): Promise<true> {
    await this.clientsUpdateService.update(id, body);
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
