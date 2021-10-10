import { Controller, Post, Body, Delete, Get, Query } from '@nestjs/common';
import { UsersCreateRequestBodyDTO, UsersDeleteRequestQueryDTO } from '../dtos';
import { UsersCreateService, UsersGettingService } from '../services';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersCreateService: UsersCreateService,
    private readonly usersGettingService: UsersGettingService,
  ) {}

  @Post()
  async create(@Body() body: UsersCreateRequestBodyDTO): Promise<true> {
    await this.usersCreateService.create(body);
    return true;
  }

  @Get()
  async getList(@Query() query: any): Promise<any> {
    return this.usersGettingService.getList(query);
  }

  @Delete()
  async delete(@Query() query: UsersDeleteRequestQueryDTO): Promise<number[]> {
    return query.ids;
  }
}
