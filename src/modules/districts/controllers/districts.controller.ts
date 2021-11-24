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
import { DistrictStatisticDTO } from '../dtos/districts-getting.dtos';
import { DistrictsGettingService } from '../services/districts-getting.service';

@Controller('districts')
export class DistrictsController {
  constructor(
    private readonly districtsGettingService: DistrictsGettingService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id/statistics')
  async getStatisticsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<DistrictStatisticDTO> {
    return this.districtsGettingService.getStatisticsById(id);
  }
}
