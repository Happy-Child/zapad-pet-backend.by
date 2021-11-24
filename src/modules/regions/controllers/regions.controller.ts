import {
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { AuthRoles } from '../../auth/decorators/auth-roles.decorators';
import { USER_ROLES } from '@app/constants';
import { DistrictStatisticDTO } from '../../districts/dtos/districts-getting.dtos';
import { RegionsGettingService } from '../services';

@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsGettingService: RegionsGettingService) {}

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id/statistics')
  async getStatisticsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DistrictStatisticDTO> {
    return this.regionsGettingService.getStatisticsById(id);
  }
}
