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
  Query,
  Request,
} from '@nestjs/common';
import {
  BidLastReviewResponseDTO,
  BidsCreateBodyDTO,
  BidsUpdateBodyDTO,
  GetBidSingleDistrictLeaderResponseDTO,
  GetBidSingleEngineerResponseDTO,
  GetBidSingleMasterResponseDTO,
  GetBidStationWorkerResponseDTO,
  GetListBidsDistrictLeaderResponseDTO,
  GetListBidsEngineerResponseDTO,
  GetListBidsMasterQueryDTO,
  GetListBidsMasterResponseDTO,
  GetListBidsResponseDTO,
  GetListBidsStationWorkerResponseDTO,
  TGetBidSingleResponseDTO,
  TGetListBidsQueryDTO,
} from '../dtos';
import { AuthRoles } from '@app/decorators/auth-roles.decorators';
import {
  DistrictLeaderMemberJWTPayloadDTO,
  MasterJWTPayloadDTO,
  StationWorkerMemberJWTPayloadDTO,
} from '../../auth/dtos';
import { USER_ROLES } from '@app/constants';
import {
  BidsAssignToEngineerService,
  BidsCreateService,
  BidsGettingGeneralService,
  BidsGettingListService,
  BidsGettingSingleService,
  BidsUpdateService,
} from '../services';
import { TMemberJwtPayloadDTO } from '../../auth/types';
import { BidsGettingListValidationPipe } from '../pipes/bids-getting-list-validation.pipe';
import { SetUserToRequestField } from '@app/decorators';
import { SET_USER_METADATA_TYPE } from '@app/guards/guards.constants';
import {
  ApiOkResponse,
  ApiQuery,
  ApiTags,
  getSchemaPath,
} from '@nestjs/swagger';

@ApiTags('bids')
@Controller('bids')
export class BidsController {
  constructor(
    private readonly bidsCreateService: BidsCreateService,
    private readonly bidsUpdateService: BidsUpdateService,
    private readonly bidsAssignToEngineerService: BidsAssignToEngineerService,
    private readonly bidsGettingGeneralService: BidsGettingGeneralService,
    private readonly bidsGettingSingleService: BidsGettingSingleService,
    private readonly bidsGettingListService: BidsGettingListService,
  ) {}

  @ApiOkResponse({ type: Boolean })
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

  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(GetListBidsMasterResponseDTO) },
        { $ref: getSchemaPath(GetListBidsDistrictLeaderResponseDTO) },
        { $ref: getSchemaPath(GetListBidsStationWorkerResponseDTO) },
        { $ref: getSchemaPath(GetListBidsEngineerResponseDTO) },
      ],
    },
  })
  @ApiQuery({ type: GetListBidsMasterQueryDTO })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(
    USER_ROLES.MASTER,
    USER_ROLES.STATION_WORKER,
    USER_ROLES.ENGINEER,
    USER_ROLES.DISTRICT_LEADER,
  )
  @SetUserToRequestField(SET_USER_METADATA_TYPE.QUERY)
  @Get()
  async getList(
    @Query(BidsGettingListValidationPipe) query: TGetListBidsQueryDTO,
    @Request() { user }: { user: TMemberJwtPayloadDTO | MasterJWTPayloadDTO },
  ): Promise<GetListBidsResponseDTO> {
    return this.bidsGettingListService.getListByPagination(query, user);
  }

  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(GetBidSingleEngineerResponseDTO) },
        { $ref: getSchemaPath(GetBidSingleDistrictLeaderResponseDTO) },
        { $ref: getSchemaPath(GetBidStationWorkerResponseDTO) },
        { $ref: getSchemaPath(GetBidSingleMasterResponseDTO) },
      ],
    },
  })
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
    @Request() { user }: { user: TMemberJwtPayloadDTO | MasterJWTPayloadDTO },
  ): Promise<TGetBidSingleResponseDTO> {
    return this.bidsGettingSingleService.getByIdOrFail(bidId, user);
  }

  @ApiOkResponse({ type: BidLastReviewResponseDTO })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(
    USER_ROLES.MASTER,
    USER_ROLES.STATION_WORKER,
    USER_ROLES.DISTRICT_LEADER,
    USER_ROLES.ENGINEER,
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
    return this.bidsGettingGeneralService.getLastReviewOrFail(bidId, user);
  }

  @ApiOkResponse({ type: Boolean })
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

  @ApiOkResponse({ type: Boolean })
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
