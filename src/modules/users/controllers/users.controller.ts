import { Controller, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import {
  UsersCreateRequestBodyDTO,
  UsersUpdateRequestBodyDTO,
  UsersDeleteRequestQueryDTO,
} from '../dtos';
import { UsersCreateService, UsersUpdateService } from '../services';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersCreateService: UsersCreateService,
    private readonly usersUpdateService: UsersUpdateService,
  ) {}

  @Post()
  async create(@Body() body: UsersCreateRequestBodyDTO): Promise<true> {
    await this.usersCreateService.create(body);
    return true;
  }

  @Patch()
  async update(@Body() body: UsersUpdateRequestBodyDTO): Promise<void> {
    await this.usersUpdateService.update(body);
  }

  @Delete()
  async delete(@Query() query: UsersDeleteRequestQueryDTO): Promise<number[]> {
    return query.ids;
  }
}
