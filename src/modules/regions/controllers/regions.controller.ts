import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthRoles } from '@app/decorators/auth-roles.decorators';
import { USER_ROLES } from '@app/constants';
import { DistrictStatisticDTO } from '../../districts/dtos/districts-getting.dtos';
import { RegionsGettingService } from '../services';
import { RegionsGetAllResponseBodyDTO } from '../dtos';

@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsGettingService: RegionsGettingService) {}

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/all')
  async getAll(): Promise<RegionsGetAllResponseBodyDTO> {
    return this.regionsGettingService.getAll();
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id/statistics')
  async getStatisticsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DistrictStatisticDTO> {
    return this.regionsGettingService.getStatisticsById(id);
  }
}
