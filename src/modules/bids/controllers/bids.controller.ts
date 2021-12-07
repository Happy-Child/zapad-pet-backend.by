import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Post,
  Put,
  Request,
} from '@nestjs/common';
import {
  BidLastReviewResponseDTO,
  BidsCreateBodyDTO,
  BidsUpdateBodyDTO,
} from '../dtos';
import { AuthRoles } from '../../auth/decorators/auth-roles.decorators';
import {
  DistrictLeaderMemberJWTPayloadDTO,
  MasterJWTPayloadDTO,
  StationWorkerMemberJWTPayloadDTO,
} from '../../auth/dtos';
import { USER_ROLES } from '@app/constants';
import {
  BidsAssignToEngineerService,
  BidsCreateService,
  BidsGettingService,
  BidsUpdateService,
} from '../services';
import { TJwtPayloadDTO } from '../../auth/types';

@Controller('bids')
export class BidsController {
  constructor(
    private readonly bidsCreateService: BidsCreateService,
    private readonly bidsUpdateService: BidsUpdateService,
    private readonly bidsAssignToEngineerService: BidsAssignToEngineerService,
    private readonly bidsGettingService: BidsGettingService,
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
  async getList(@Request() { user }: { user: TJwtPayloadDTO }): Promise<any> {
    return this.bidsGettingService.getListWithPagination(user);
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(
    USER_ROLES.MASTER,
    USER_ROLES.STATION_WORKER,
    USER_ROLES.ENGINEER,
    USER_ROLES.DISTRICT_LEADER,
  )
  @Get('/:bidId')
  async getById(
    @Param('bidId', ParseIntPipe) bidId: number,
    @Request() { user }: { user: TJwtPayloadDTO },
  ): Promise<any> {
    return this.bidsGettingService.getByIdOrFail(bidId, user);
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(
    USER_ROLES.MASTER,
    USER_ROLES.STATION_WORKER,
    USER_ROLES.DISTRICT_LEADER,
  )
  @Get('/:bidId/last-review')
  async getLastReview(
    @Param('bidId', ParseIntPipe) bidId: number,
    @Request()
    {
      user,
    }: {
      user:
        | DistrictLeaderMemberJWTPayloadDTO
        | StationWorkerMemberJWTPayloadDTO
        | MasterJWTPayloadDTO;
    },
  ): Promise<BidLastReviewResponseDTO> {
    return this.bidsGettingService.getLastReviewOrFail(bidId, user);
  }

  @HttpCode(HttpStatus.CREATED)
  @AuthRoles(USER_ROLES.STATION_WORKER)
  @Put('/:bidId')
  async update(
    @Request() { user }: { user: StationWorkerMemberJWTPayloadDTO },
    @Param('bidId', ParseIntPipe) bidId: number,
    @Body() body: BidsUpdateBodyDTO,
  ): Promise<true> {
    await this.bidsUpdateService.executeOrFail(bidId, user, body);
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.DISTRICT_LEADER)
  @Post('/:bidId/assignment-engineer/:engineerId')
  async assignmentToEngineer(
    @Param('bidId', ParseIntPipe) bidId: number,
    @Param('engineerId', ParseIntPipe) engineerId: number,
    @Request() { user }: { user: DistrictLeaderMemberJWTPayloadDTO },
  ): Promise<true> {
    await this.bidsAssignToEngineerService.executeOrFail(
      bidId,
      engineerId,
      user,
    );
    return true;
  }
}
