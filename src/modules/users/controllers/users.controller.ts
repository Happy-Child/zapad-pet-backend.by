import {
  Controller,
  Post,
  Body,
  Delete,
  Get,
  Query,
  Put,
  HttpCode,
  HttpStatus,
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

  @HttpCode(HttpStatus.OK)
  @Post()
  async create(@Body() body: UsersCreateRequestBodyDTO): Promise<true> {
    await this.usersCreateService.execute(body);
    return true;
  }

  @HttpCode(HttpStatus.CREATED)
  @Put()
  async update(@Body() body: UsersUpdateRequestBodyDTO): Promise<true> {
    await this.usersUpdateService.execute(body);
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @Get()
  async getList(@Query() query: UsersGetListRequestQueryDTO): Promise<any> {
    return this.usersGettingService.getList(query);
  }

  @HttpCode(HttpStatus.OK)
  @Delete()
  async delete(@Query() query: UsersDeleteRequestQueryDTO): Promise<number[]> {
    return query.ids;
  }
}
