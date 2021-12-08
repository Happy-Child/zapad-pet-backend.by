import {
  Controller,
  Get,
  Post,
  Body,
  Put,
  Param,
  ParseIntPipe,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClientExtendedDTO } from '../dtos';
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
import { USER_ROLES } from '@app/constants';
import { AuthRoles } from '@app/decorators/auth-roles.decorators';

@Controller('clients')
export class ClientsController {
  constructor(
    private readonly clientsCreateService: ClientsCreateService,
    private readonly clientsUpdateService: ClientsUpdateService,
    private readonly clientsGettingService: ClientsGettingService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Post()
  async create(@Body() body: ClientEntity): Promise<true> {
    await this.clientsCreateService.create(body);
    return true;
  }

  @HttpCode(HttpStatus.CREATED)
  @AuthRoles(USER_ROLES.MASTER)
  @Put('/:id')
  async update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: ClientsUpdateBodyDTO,
  ): Promise<true> {
    await this.clientsUpdateService.update(id, body);
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ClientExtendedDTO> {
    return this.clientsGettingService.getByIdOrFail(id);
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get()
  async getList(
    @Query() query: ClientsGettingRequestQueryDTO,
  ): Promise<ClientsGettingResponseBodyDTO> {
    return this.clientsGettingService.getList(query);
  }
}
