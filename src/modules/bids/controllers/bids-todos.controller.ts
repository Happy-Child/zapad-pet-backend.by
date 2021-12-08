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

@Controller('bids/:bidId/todos')
export class BidsTodosController {
  constructor(
    private readonly bidsTodosChangeStatusService: BidsTodosChangeStatusService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.ENGINEER)
  @Post(
    `/:todoId/:status(${BID_TODO_STATUS.IN_WORK}|${BID_TODO_STATUS.COMPLETED})`,
  )
  async setBidTodosStatus(
    @Param() { bidId, todoId, status }: BidsTodosChangeStatusParamsDTO,
    @Request() { user }: { user: EngineerMemberJWTPayloadDTO },
  ): Promise<true> {
    await this.bidsTodosChangeStatusService.executeOrFail(
      bidId,
      todoId,
      user,
      status,
    );
    return true;
  }
}
