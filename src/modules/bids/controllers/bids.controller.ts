import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Put,
  Post,
  Request,
} from '@nestjs/common';
import { BidsCreateBodyDTO, BidsUpdateBodyDTO } from '../dtos';
import { BidsGeneralService } from '../services';
import { AuthRoles } from '../../auth/decorators/auth-roles.decorators';
import { USER_ROLES } from '../../users/constants';
import { StationWorkerMemberJWTPayloadDTO } from '../../auth/dtos';

@Controller('bids')
export class BidsController {
  constructor(private readonly bidsGeneralService: BidsGeneralService) {}

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.STATION_WORKER)
  @Post()
  async create(
    @Request() { user }: { user: StationWorkerMemberJWTPayloadDTO },
    @Body() body: BidsCreateBodyDTO,
  ): Promise<true> {
    await this.bidsGeneralService.create(body, user.stationId);
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.STATION_WORKER)
  @Put('/:id')
  async update(
    @Request() { user }: { user: StationWorkerMemberJWTPayloadDTO },
    @Param('id', ParseIntPipe) id: number,
    @Body() body: BidsUpdateBodyDTO,
  ): Promise<true> {
    await this.bidsGeneralService.update(id, user.stationId, body);
    return true;
  }
}
