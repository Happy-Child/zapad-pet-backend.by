import {
  Controller,
  Post,
  Get,
  Body,
  Put,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  StationExtendedDTO,
  StationsCreateRequestBodyDTO,
  StationsUpdateRequestBodyDTO,
} from '../dtos';
import { StationsCreateService, StationsUpdateService } from '../services';
import { USER_ROLES } from '@app/constants';
import { AuthRoles } from '../../auth/decorators/auth-roles.decorators';

@Controller('stations')
export class StationsController {
  constructor(
    private readonly stationsCreateService: StationsCreateService,
    private readonly stationsUpdateService: StationsUpdateService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get()
  async getList(): Promise<void> {
    //
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Post()
  async create(
    @Body() body: StationsCreateRequestBodyDTO,
  ): Promise<StationExtendedDTO[]> {
    return this.stationsCreateService.execute(body);
  }

  @HttpCode(HttpStatus.CREATED)
  @AuthRoles(USER_ROLES.MASTER)
  @Put()
  async update(
    @Body() body: StationsUpdateRequestBodyDTO,
  ): Promise<StationExtendedDTO[]> {
    return this.stationsUpdateService.execute(body);
  }
}
