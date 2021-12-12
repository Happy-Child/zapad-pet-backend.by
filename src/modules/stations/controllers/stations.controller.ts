import {
  Controller,
  Post,
  Get,
  Body,
  Put,
  HttpCode,
  HttpStatus,
  Query,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import {
  StationExtendedDTO,
  StationsCreateRequestBodyDTO,
  StationsUpdateRequestBodyDTO,
} from '../dtos';
import {
  StationsCreateService,
  StationsGettingService,
  StationsUpdateService,
} from '../services';
import { USER_ROLES } from '@app/constants';
import { AuthRoles } from '@app/decorators/auth-roles.decorators';
import {
  StationsGetListRequestQueryDTO,
  StationsGetListResponseBodyDTO,
  StationStatisticDTO,
  StationWithStatisticsDTO,
} from '../dtos/stations-getting.dtos';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('stations')
@Controller('stations')
export class StationsController {
  constructor(
    private readonly stationsCreateService: StationsCreateService,
    private readonly stationsUpdateService: StationsUpdateService,
    private readonly stationsGettingService: StationsGettingService,
  ) {}

  @ApiOkResponse({ type: StationsGetListResponseBodyDTO })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get()
  async getList(
    @Query() query: StationsGetListRequestQueryDTO,
  ): Promise<StationsGetListResponseBodyDTO> {
    return this.stationsGettingService.getList(query);
  }

  @ApiOkResponse({ type: StationWithStatisticsDTO })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StationWithStatisticsDTO> {
    return this.stationsGettingService.getById(id);
  }

  @ApiOkResponse({ type: StationStatisticDTO })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id/statistics')
  async getStatisticsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<StationStatisticDTO> {
    return this.stationsGettingService.getStatisticsById(id);
  }

  @ApiOkResponse({ type: StationExtendedDTO, isArray: true })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Post()
  async create(
    @Body() body: StationsCreateRequestBodyDTO,
  ): Promise<StationExtendedDTO[]> {
    return this.stationsCreateService.execute(body);
  }

  @ApiOkResponse({ type: StationExtendedDTO, isArray: true })
  @HttpCode(HttpStatus.CREATED)
  @AuthRoles(USER_ROLES.MASTER)
  @Put()
  async update(
    @Body() body: StationsUpdateRequestBodyDTO,
  ): Promise<StationExtendedDTO[]> {
    return this.stationsUpdateService.execute(body);
  }
}
