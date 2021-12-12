import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Request,
} from '@nestjs/common';
import {
  BidsChangeEditableStatusParamsDTO,
  BidsEndWorkRequestBodyDTO,
  BidsSetRejectedReviewStatusRequestBodyDTO,
} from '../dtos';
import { AuthRoles } from '@app/decorators/auth-roles.decorators';
import {
  DistrictLeaderMemberJWTPayloadDTO,
  EngineerMemberJWTPayloadDTO,
  StationWorkerMemberJWTPayloadDTO,
} from '../../auth/dtos';
import { BID_EDITABLE_STATUS } from '../constants';
import { USER_ROLES } from '@app/constants';
import {
  BidsCancelService,
  BidsChangeEditableStatusService,
  BidsSetReviewStatusService,
  BidsStartEndWorksService,
} from '../services';
import { TJwtPayloadDTO } from '../../auth/types';
import { BidsSetReviewStatusRequestParamsDTO } from '../dtos';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('bids')
@Controller('bids/:bidId')
export class BidsChangeStatusesController {
  constructor(
    private readonly bidsChangeEditableStatusService: BidsChangeEditableStatusService,
    private readonly bidsStartEndWorksService: BidsStartEndWorksService,
    private readonly bidsCancelService: BidsCancelService,
    private readonly bidsSetReviewStatusService: BidsSetReviewStatusService,
  ) {}

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.ENGINEER)
  @Post('/start-work')
  async startWork(
    @Param('bidId', ParseIntPipe) bidId: number,
    @Request() { user }: { user: EngineerMemberJWTPayloadDTO },
  ): Promise<true> {
    await this.bidsStartEndWorksService.startWorkOrFail(bidId, user);
    return true;
  }

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.ENGINEER)
  @Post('/end-work')
  async endWork(
    @Param('bidId', ParseIntPipe) bidId: number,
    @Body() { imageFileId }: BidsEndWorkRequestBodyDTO,
    @Request() { user }: { user: EngineerMemberJWTPayloadDTO },
  ): Promise<true> {
    await this.bidsStartEndWorksService.endWorkOrFail(bidId, user, imageFileId);
    return true;
  }

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.DISTRICT_LEADER, USER_ROLES.STATION_WORKER)
  @Post(`/review/accepted`)
  async setAcceptedReviewStatus(
    @Request()
    {
      user,
    }: {
      user:
        | StationWorkerMemberJWTPayloadDTO
        | DistrictLeaderMemberJWTPayloadDTO;
    },
    @Param() { bidId }: BidsSetReviewStatusRequestParamsDTO,
  ): Promise<true> {
    return this.bidsSetReviewStatusService.setAcceptedStatusOrFail(bidId, user);
  }

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.DISTRICT_LEADER, USER_ROLES.STATION_WORKER)
  @Post(`/review/rejected`)
  async setRejectedReviewStatus(
    @Request()
    {
      user,
    }: {
      user:
        | StationWorkerMemberJWTPayloadDTO
        | DistrictLeaderMemberJWTPayloadDTO;
    },
    @Param() { bidId }: BidsSetReviewStatusRequestParamsDTO,
    @Body() { text }: BidsSetRejectedReviewStatusRequestBodyDTO,
  ): Promise<true> {
    return this.bidsSetReviewStatusService.setRejectedStatusOrFail(
      bidId,
      user,
      text,
    );
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.STATION_WORKER)
  @Post(
    `/:isEditable(${BID_EDITABLE_STATUS.EDITABLE}|${BID_EDITABLE_STATUS.UNEDITABLE})`,
  )
  async changeEditableStatus(
    @Request() { user }: { user: StationWorkerMemberJWTPayloadDTO },
    @Param() { bidId, isEditable }: BidsChangeEditableStatusParamsDTO,
  ): Promise<true> {
    await this.bidsChangeEditableStatusService.executeOrFail(
      bidId,
      user,
      isEditable,
    );
    return true;
  }

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(
    USER_ROLES.MASTER,
    USER_ROLES.STATION_WORKER,
    USER_ROLES.DISTRICT_LEADER,
  )
  @Post('/cancel')
  async cancelBid(
    @Param('bidId', ParseIntPipe) bidId: number,
    @Request() { user }: { user: TJwtPayloadDTO },
  ): Promise<true> {
    await this.bidsCancelService.executeOrFail(bidId, user);
    return true;
  }
}
