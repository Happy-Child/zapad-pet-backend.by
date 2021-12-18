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
  Query,
} from '@nestjs/common';
import { USER_ROLES } from '@app/constants';
import { AuthRoles } from '@app/decorators/auth-roles.decorators';
import {
  DistrictsGetAllResponseBodyDTO,
  DistrictStatisticDTO,
  DistrictWithStatisticsDTO,
} from '../dtos/districts-getting.dtos';
import {
  DistrictsChangeEngineersService,
  DistrictsChangeLeadersService,
  DistrictsGettingService,
} from '../services';
import { ShortEngineerMemberDTO } from '../../engineers/dtos';
import {
  DistrictAddEngineersRequestBodyDTO,
  DistrictRemoveEngineersRequestQueryDTO,
} from '../dtos/districts-change.dtos';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('districts')
@Controller('districts')
export class DistrictsController {
  constructor(
    private readonly districtsGettingService: DistrictsGettingService,
    private readonly districtsChangeLeadersService: DistrictsChangeLeadersService,
    private readonly districtsChangeEngineersService: DistrictsChangeEngineersService,
  ) {}

  @ApiOkResponse({ type: DistrictsGetAllResponseBodyDTO })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(
    USER_ROLES.MASTER,
    USER_ROLES.ENGINEER,
    USER_ROLES.STATION_WORKER,
    USER_ROLES.DISTRICT_LEADER,
  )
  @Get('/all')
  async getAll(): Promise<DistrictsGetAllResponseBodyDTO> {
    return this.districtsGettingService.getAll();
  }

  @ApiOkResponse({ type: DistrictWithStatisticsDTO })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DistrictWithStatisticsDTO> {
    return this.districtsGettingService.getById(id);
  }

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Post('/:id/leader/:userId')
  async changeLeader(
    @Param('id', ParseIntPipe) districtId: number,
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<true> {
    await this.districtsChangeLeadersService.changeLeader(districtId, userId);
    return true;
  }

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Delete('/:id/leader')
  async deleteLeader(
    @Param('id', ParseIntPipe) districtId: number,
  ): Promise<true> {
    await this.districtsChangeLeadersService.deleteLeader(districtId);
    return true;
  }

  // @ApiOkResponse({ type: ShortEngineerMemberDTO, isArray: true })
  // @HttpCode(HttpStatus.OK)
  // @AuthRoles(USER_ROLES.MASTER)
  // @Get('/:id/engineers')
  // async getEngineersById(
  //   @Param('id', ParseIntPipe) id: number,
  // ): Promise<ShortEngineerMemberDTO[]> {
  //   return this.districtsGettingService.getEngineersById(id);
  // }

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Post('/:id/engineers')
  async addEngineers(
    @Param('id', ParseIntPipe) districtId: number,
    @Body() { ids }: DistrictAddEngineersRequestBodyDTO,
  ): Promise<true> {
    await this.districtsChangeEngineersService.addEngineers(districtId, ids);
    return true;
  }

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Delete('/:id/engineers')
  async removeEngineers(
    @Param('id', ParseIntPipe) districtId: number,
    @Query() { ids }: DistrictRemoveEngineersRequestQueryDTO,
  ): Promise<true> {
    await this.districtsChangeEngineersService.removeEngineers(districtId, ids);
    return true;
  }

  @ApiOkResponse({ type: DistrictStatisticDTO })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id/statistics')
  async getStatisticsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DistrictStatisticDTO> {
    return this.districtsGettingService.getStatisticsById(id);
  }
}
