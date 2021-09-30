import { Controller, Post, Body, Delete, Query } from '@nestjs/common';
import { UsersCreateRequestBodyDTO, UsersDeleteRequestQueryDTO } from '../dtos';
import { UsersCreateService } from '../services';

@Controller('users')
export class UsersController {
  constructor(private readonly usersCreateService: UsersCreateService) {}

  @Post()
  async create(@Body() body: UsersCreateRequestBodyDTO): Promise<true> {
    await this.usersCreateService.create(body);
    return true;
  }

  @Delete()
  async delete(@Query() query: UsersDeleteRequestQueryDTO): Promise<number[]> {
    return query.ids;
  }
}
