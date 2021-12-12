import {
  Controller,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Request,
} from '@nestjs/common';
import { AuthRoles } from '@app/decorators/auth-roles.decorators';
import { USER_ROLES } from '@app/constants';
import { BID_TODO_STATUS } from '../constants';
import { BidsTodosChangeStatusService } from '../services';
import { EngineerMemberJWTPayloadDTO } from '../../auth/dtos';
import { BidsTodosChangeStatusParamsDTO } from '../dtos';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';

@ApiTags('bids')
@Controller('bids/:bidId/todos')
export class BidsTodosController {
  constructor(
    private readonly bidsTodosChangeStatusService: BidsTodosChangeStatusService,
  ) {}

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.ENGINEER)
  @Post(
    `/:todoId/:nextStatus(${BID_TODO_STATUS.IN_WORK}|${BID_TODO_STATUS.COMPLETED})`,
  )
  async setBidTodosStatus(
    @Param() { bidId, todoId, nextStatus }: BidsTodosChangeStatusParamsDTO,
    @Request() { user }: { user: EngineerMemberJWTPayloadDTO },
  ): Promise<true> {
    await this.bidsTodosChangeStatusService.executeOrFail(
      bidId,
      todoId,
      user,
      nextStatus,
    );
    return true;
  }
}
