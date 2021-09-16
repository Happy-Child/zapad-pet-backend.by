import { Controller, Post, Body, Patch, Delete, Query } from '@nestjs/common';
import { UsersCreateRequestBodyDTO } from '../dtos/create.dtos';
import { UsersUpdateRequestBodyDTO } from '../dtos/update.dtos';
import { UsersCreateService } from '../services/create/users-create.service';
import { UsersDeleteRequestQueryDTO } from '../dtos/delete.dtos';
import { UsersUpdateService } from '../services/update/users-update.service';

// Расширенная проверка

// CHECK_CLIENT_ID:
// 1. Если работник станиции привязан в станции - то ошибка

// CHECK_DISTRICT_ID:
// 1. Инжинер. ХЗ
// 2. Руководитель района. ХЗ

// name
// email - needed confirmation
// clientId - :CHECK_CLIENT_ID - STATION_WORKER
// districtId - :CHECK_DISTRICT_ID - CLIENT_MEMBERS

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersCreateService: UsersCreateService,
    private readonly usersUpdateService: UsersUpdateService,
  ) {}

  @Post()
  async create(@Body() body: UsersCreateRequestBodyDTO): Promise<void> {
    await this.usersCreateService.create(body);
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
