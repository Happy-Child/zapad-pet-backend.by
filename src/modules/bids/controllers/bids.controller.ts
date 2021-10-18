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
import {
  BidsChangeEditableStatusParamsDTO,
  BidsCreateBodyDTO,
  BidsUpdateBodyDTO,
} from '../dtos';
import {
  BidsCreateService,
  BidsGeneralService,
  BidsUpdateService,
} from '../services';
import { AuthRoles } from '../../auth/decorators/auth-roles.decorators';
import { USER_ROLES } from '../../users/constants';
import { StationWorkerMemberJWTPayloadDTO } from '../../auth/dtos';
import { BID_EDITABLE_STATUS } from '../constants';

@Controller('bids')
export class BidsController {
  constructor(
    private readonly bidsGeneralService: BidsGeneralService,
    private readonly bidsCreateService: BidsCreateService,
    private readonly bidsUpdateService: BidsUpdateService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.STATION_WORKER)
  @Post()
  async create(
    @Request() { user }: { user: StationWorkerMemberJWTPayloadDTO },
    @Body() body: BidsCreateBodyDTO,
  ): Promise<true> {
    await this.bidsCreateService.create(body, user.stationId);
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
    await this.bidsUpdateService.update(id, user.stationId, body);
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.STATION_WORKER)
  @Post(
    `/:id/:isEditable(${BID_EDITABLE_STATUS.EDITABLE}|${BID_EDITABLE_STATUS.UNEDITABLE})`,
  )
  async changeEditableStatus(
    @Request() { user }: { user: StationWorkerMemberJWTPayloadDTO },
    @Param() { id, isEditable }: BidsChangeEditableStatusParamsDTO,
  ): Promise<true> {
    await this.bidsGeneralService.changeEditableStatus(
      id,
      user.stationId,
      isEditable,
    );
    return true;
  }
}
