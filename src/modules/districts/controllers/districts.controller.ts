import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { USER_ROLES } from '@app/constants';
import { AuthRoles } from '../../auth/decorators/auth-roles.decorators';
import {
  DistrictsGetAllResponseBodyDTO,
  DistrictStatisticDTO,
  DistrictWithStatisticsDTO,
} from '../dtos/districts-getting.dtos';
import { DistrictsGettingService } from '../services';
import { ShortEngineerMemberDTO } from '../../engineers/dtos';

@Controller('districts')
export class DistrictsController {
  constructor(
    private readonly districtsGettingService: DistrictsGettingService,
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
  @Get('/:id/engineers')
  async getEngineersById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ShortEngineerMemberDTO[]> {
    return this.districtsGettingService.getEngineersById(id);
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
