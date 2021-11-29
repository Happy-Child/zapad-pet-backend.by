import {
  Get,
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import {
  BidsChangeEditableStatusParamsDTO,
  BidsCreateBodyDTO,
  BidsUpdateBodyDTO,
} from '../dtos';
import { AuthRoles } from '../../auth/decorators/auth-roles.decorators';
import {
  DistrictLeaderMemberJWTPayloadDTO,
  EngineerMemberJWTPayloadDTO,
  StationWorkerMemberJWTPayloadDTO,
} from '../../auth/dtos';
import { BID_EDITABLE_STATUS } from '../constants';
import { USER_ROLES } from '@app/constants';
import {
  BidsAssignToEngineerService,
  BidsChangeEditableStatusService,
  BidsUpdateService,
  BidsCreateService,
  BidsStartEndWorksService,
} from '../services';

@Controller('bids')
export class BidsController {
  constructor(
    private readonly bidsChangeEditableStatusService: BidsChangeEditableStatusService,
    private readonly bidsCreateService: BidsCreateService,
    private readonly bidsUpdateService: BidsUpdateService,
    private readonly bidsAssignToEngineerService: BidsAssignToEngineerService,
    private readonly bidsStartEndWorksService: BidsStartEndWorksService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
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
  @AuthRoles(
    USER_ROLES.MASTER,
    USER_ROLES.STATION_WORKER,
    USER_ROLES.ENGINEER,
    USER_ROLES.DISTRICT_LEADER,
  )
  @Get()
  async getList(): Promise<any> {
    // TODO strategy for every role?
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(
    USER_ROLES.MASTER,
    USER_ROLES.STATION_WORKER,
    USER_ROLES.ENGINEER,
    USER_ROLES.DISTRICT_LEADER,
  )
  @Get('/:id')
  async getById(): Promise<any> {
    //
  }

  @HttpCode(HttpStatus.CREATED)
  @AuthRoles(USER_ROLES.STATION_WORKER)
  @Put('/:bidId')
  async update(
    @Request() { user }: { user: StationWorkerMemberJWTPayloadDTO },
    @Param('bidId', ParseIntPipe) bidId: number,
    @Body() body: BidsUpdateBodyDTO,
  ): Promise<true> {
    await this.bidsUpdateService.update(bidId, user.stationId, body);
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.DISTRICT_LEADER)
  @Post('/:bidId/assignment-engineer/:userId')
  async assignmentToEngineer(
    @Param('bidId', ParseIntPipe) bidId: number,
    @Param('userId', ParseIntPipe) userId: number,
    @Request() { user }: { user: DistrictLeaderMemberJWTPayloadDTO },
  ): Promise<true> {
    await this.bidsAssignToEngineerService.executeOrFail(
      bidId,
      userId,
      user.leaderDistrictId,
    );
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.ENGINEER)
  @Post('/:bidId/start-work')
  async startWork(
    @Param('bidId', ParseIntPipe) bidId: number,
    @Request() { user }: { user: EngineerMemberJWTPayloadDTO },
  ): Promise<true> {
    await this.bidsStartEndWorksService.startWorkOrFail(bidId, user.userId);
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.ENGINEER)
  @Post('/:bidId/end-work')
  async endWork(
    @Param('bidId', ParseIntPipe) bidId: number,
    @Body() { photo }: any,
    @Request() { user }: { user: EngineerMemberJWTPayloadDTO },
  ): Promise<true> {
    await this.bidsStartEndWorksService.endWorkOrFail(
      bidId,
      user.userId,
      photo,
    );
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.DISTRICT_LEADER)
  @Post('/:id/leader-review/:reviewStatus')
  async setReviewStatusFromLeader(): Promise<any> {
    // + необязат коммент если отклонение
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.STATION_WORKER)
  @Post('/:id/worker-review/:reviewStatus')
  async setReviewStatusFromWorker(): Promise<any> {
    // + необязат коммент если отклонение
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
    await this.bidsChangeEditableStatusService.executeOrFail(
      id,
      user.stationId,
      isEditable,
    );
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(
    USER_ROLES.MASTER,
    USER_ROLES.STATION_WORKER,
    USER_ROLES.DISTRICT_LEADER,
  )
  @Post('/:bidId/cancel')
  async cancelBid(): Promise<any> {
    // TODO strategy for every role?
  }
}
