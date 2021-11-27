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
import {
  BidsCreateService,
  BidsGeneralService,
  BidsUpdateService,
} from '../services';
import { AuthRoles } from '../../auth/decorators/auth-roles.decorators';
import { StationWorkerMemberJWTPayloadDTO } from '../../auth/dtos';
import { BID_EDITABLE_STATUS } from '../constants';
import { USER_ROLES } from '@app/constants';

@Controller('bids')
export class BidsController {
  constructor(
    private readonly bidsGeneralService: BidsGeneralService,
    private readonly bidsCreateService: BidsCreateService,
    private readonly bidsUpdateService: BidsUpdateService,
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
  @Put('/:id')
  async update(
    @Request() { user }: { user: StationWorkerMemberJWTPayloadDTO },
    @Param('id', ParseIntPipe) id: number,
    @Body() body: BidsUpdateBodyDTO,
  ): Promise<true> {
    await this.bidsUpdateService.update(id, user.stationId, body);
    return true;
  }

  // TODO change todo list for engineer

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.ENGINEER)
  @Post('/:id/start-work')
  async startWork(): Promise<any> {
    //
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.ENGINEER)
  @Post('/:id/end-work')
  async endWork(): Promise<any> {
    //
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.DISTRICT_LEADER)
  @Post('/:id/assignment-engineer/:userId')
  async assignmentToEngineer(): Promise<any> {
    //
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(
    USER_ROLES.MASTER,
    USER_ROLES.STATION_WORKER,
    USER_ROLES.DISTRICT_LEADER,
  )
  @Post('/:id/change-status/:status')
  async changeStatus(): Promise<any> {
    // TODO strategy for every role?
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.STATION_WORKER)
  @Post('/:id/worker-review/:reviewStatus')
  async setReviewStatusFromWorker(): Promise<any> {
    // + необязат коммент если отклонение
  }

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.DISTRICT_LEADER)
  @Post('/:id/leader-review/:reviewStatus')
  async setReviewStatusFromLeader(): Promise<any> {
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
    await this.bidsGeneralService.changeEditableStatus(
      id,
      user.stationId,
      isEditable,
    );
    return true;
  }
}
