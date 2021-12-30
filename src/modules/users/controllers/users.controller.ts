import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Query,
  Request,
  Res,
} from '@nestjs/common';
import {
  AccountantDTO,
  MasterDTO,
  UsersCreateRequestBodyDTO,
  UsersDeleteRequestQueryDTO,
} from '../dtos';
import {
  UsersCreateService,
  UsersDeleteService,
  UsersGettingService,
  UsersUpdateService,
  UsersUpdateSingleService,
} from '../services';
import {
  UsersGetListRequestQueryDTO,
  UsersGetListResponseBodyDTO,
} from '../dtos/users-getting.dtos';
import { UsersUpdateRequestBodyDTO } from '../dtos/users-update.dtos';
import { USER_ROLES } from '@app/constants';
import { AuthRoles } from '@app/decorators/auth-roles.decorators';
import { TUserDTO } from '../types';
import { UsersUpdateSingleRequestBodyDTO } from '../dtos/users-update-single.dtos';
import { TJwtPayloadDTO } from '../../auth/types';
import { ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
import { EngineerMemberDTO } from '../../engineers/dtos';
import { StationWorkerMemberDTO } from '../../stations-workers/dtos';
import { DistrictLeaderMemberDTO } from '../../districts-leaders/dtos';
import { logoutByResponse } from '@app/helpers';

@ApiTags('users')
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersCreateService: UsersCreateService,
    private readonly usersUpdateService: UsersUpdateService,
    private readonly usersUpdateSingleService: UsersUpdateSingleService,
    private readonly usersGettingService: UsersGettingService,
    private readonly usersDeleteService: UsersDeleteService,
  ) {}

  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(MasterDTO) },
        { $ref: getSchemaPath(AccountantDTO) },
        { $ref: getSchemaPath(DistrictLeaderMemberDTO) },
        { $ref: getSchemaPath(EngineerMemberDTO) },
        { $ref: getSchemaPath(StationWorkerMemberDTO) },
      ],
    },
  })
  @HttpCode(HttpStatus.OK)
  @AuthRoles()
  @Put('/user')
  async updateById(
    @Request() { user }: { user: TJwtPayloadDTO },
    @Body() body: UsersUpdateSingleRequestBodyDTO,
    @Res() res: any,
  ): Promise<void> {
    const { user: updatedUser, canBeLogout } =
      await this.usersUpdateSingleService.executeOrFail(user.userId, body);

    if (canBeLogout) {
      logoutByResponse(res, updatedUser);
      return;
    }

    res.send(updatedUser);
  }

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Post()
  async create(@Body() body: UsersCreateRequestBodyDTO): Promise<true> {
    await this.usersCreateService.execute(body);
    return true;
  }

  @ApiOkResponse({
    isArray: true,
    schema: {
      oneOf: [
        { $ref: getSchemaPath(MasterDTO) },
        { $ref: getSchemaPath(AccountantDTO) },
        { $ref: getSchemaPath(DistrictLeaderMemberDTO) },
        { $ref: getSchemaPath(EngineerMemberDTO) },
        { $ref: getSchemaPath(StationWorkerMemberDTO) },
      ],
    },
  })
  @HttpCode(HttpStatus.CREATED)
  @AuthRoles(USER_ROLES.MASTER)
  @Put()
  async update(@Body() body: UsersUpdateRequestBodyDTO): Promise<TUserDTO[]> {
    return this.usersUpdateService.execute(body);
  }

  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(MasterDTO) },
        { $ref: getSchemaPath(AccountantDTO) },
        { $ref: getSchemaPath(DistrictLeaderMemberDTO) },
        { $ref: getSchemaPath(EngineerMemberDTO) },
        { $ref: getSchemaPath(StationWorkerMemberDTO) },
      ],
    },
  })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id')
  async getById(@Param('id', ParseIntPipe) id: number): Promise<TUserDTO> {
    return this.usersGettingService.getUserOrFail(id);
  }

  @ApiOkResponse({ type: UsersGetListResponseBodyDTO })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get()
  async getList(
    @Query() query: UsersGetListRequestQueryDTO,
  ): Promise<UsersGetListResponseBodyDTO> {
    return this.usersGettingService.getList(query);
  }

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Delete()
  async delete(@Query() { ids }: UsersDeleteRequestQueryDTO): Promise<true> {
    return this.usersDeleteService.execute(ids);
  }
}
