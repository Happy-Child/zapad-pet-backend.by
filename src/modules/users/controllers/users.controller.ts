import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Query,
  Put,
} from '@nestjs/common';
import { UsersCreateRequestBodyDTO, UsersDeleteRequestQueryDTO } from '../dtos';
import {
  UsersUpdateService,
  UsersGettingService,
  UsersCreateService,
} from '../services';
import { UsersGetListRequestQueryDTO } from '../dtos/users-getting.dtos';
import { UsersUpdateRequestBodyDTO } from '../dtos/users-update.dtos';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersCreateService: UsersCreateService,
    private readonly usersUpdateService: UsersUpdateService,
    private readonly usersGettingService: UsersGettingService,
  ) {}

  @Post()
  async create(@Body() body: UsersCreateRequestBodyDTO): Promise<true> {
    await this.usersCreateService.create(body);
    return true;
  }

  @Put()
  async update(@Body() body: UsersUpdateRequestBodyDTO): Promise<true> {
    await this.usersUpdateService.update(body);
    return true;
  }

  @Get()
  async getList(@Query() query: UsersGetListRequestQueryDTO): Promise<any> {
    return this.usersGettingService.getList(query);
  }

  @Delete()
  async delete(@Query() query: UsersDeleteRequestQueryDTO): Promise<number[]> {
    return query.ids;
  }
}
