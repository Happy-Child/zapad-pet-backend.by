import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Delete,
  Body,
  Param,
  ParseIntPipe,
  Query,
} from '@nestjs/common';
import { USER_ROLES } from '@app/constants';
import { AuthRoles } from '../../auth/decorators/auth-roles.decorators';
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

@Controller('districts')
export class DistrictsController {
  constructor(
    private readonly districtsGettingService: DistrictsGettingService,
    private readonly districtsChangeLeadersService: DistrictsChangeLeadersService,
    private readonly districtsChangeEngineersService: DistrictsChangeEngineersService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/all')
  async getAll(): Promise<DistrictsGetAllResponseBodyDTO> {
    return this.districtsGettingService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DistrictWithStatisticsDTO> {
    return this.districtsGettingService.getById(id);
  }

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

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Delete('/:id/leader')
  async deleteLeader(
    @Param('id', ParseIntPipe) districtId: number,
  ): Promise<true> {
    await this.districtsChangeLeadersService.deleteLeader(districtId);
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id/engineers')
  async getEngineersById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShortEngineerMemberDTO[]> {
    return this.districtsGettingService.getEngineersById(id);
  }

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

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id/statistics')
  async getStatisticsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DistrictStatisticDTO> {
    return this.districtsGettingService.getStatisticsById(id);
  }
}
