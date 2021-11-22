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
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersCreateRequestBodyDTO, UsersDeleteRequestQueryDTO } from '../dtos';
import {
  UsersUpdateService,
  UsersGettingService,
  UsersCreateService,
} from '../services';
import {
  UsersGetListRequestQueryDTO,
  UsersGetListResponseBodyDTO,
} from '../dtos/users-getting.dtos';
import { UsersUpdateRequestBodyDTO } from '../dtos/users-update.dtos';
import { USER_ROLES } from '@app/constants';
import { AuthRoles } from '../../auth/decorators/auth-roles.decorators';
import { TUserDTO } from '../types';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersCreateService: UsersCreateService,
    private readonly usersUpdateService: UsersUpdateService,
    private readonly usersGettingService: UsersGettingService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Post()
  async create(@Body() body: UsersCreateRequestBodyDTO): Promise<true> {
    await this.usersCreateService.execute(body);
    return true;
  }

  @HttpCode(HttpStatus.CREATED)
  @AuthRoles(USER_ROLES.MASTER)
  @Put()
  async update(@Body() body: UsersUpdateRequestBodyDTO): Promise<TUserDTO[]> {
    return this.usersUpdateService.execute(body);
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<TUserDTO> {
    return this.usersGettingService.getFullUserOrFail({ id });
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get()
  async getList(
    @Query() query: UsersGetListRequestQueryDTO,
  ): Promise<UsersGetListResponseBodyDTO> {
    return this.usersGettingService.getList(query);
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Delete()
  async delete(@Query() query: UsersDeleteRequestQueryDTO): Promise<number[]> {
    return query.ids;
  }
}
