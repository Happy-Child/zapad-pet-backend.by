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
import { RegionsGettingService } from '../services';
import { RegionsGetAllResponseBodyDTO, RegionStatisticDTO } from '../dtos';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('regions')
@Controller('regions')
export class RegionsController {
  constructor(private readonly regionsGettingService: RegionsGettingService) {}

  @ApiOkResponse({ type: RegionsGetAllResponseBodyDTO })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/all')
  async getAll(): Promise<RegionsGetAllResponseBodyDTO> {
    return this.regionsGettingService.getAll();
  }

  @ApiOkResponse({ type: RegionStatisticDTO })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.MASTER)
  @Get('/:id/statistics')
  async getStatisticsById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<RegionStatisticDTO> {
    return this.regionsGettingService.getStatisticsById(id);
  }
}
