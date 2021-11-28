import { Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { AuthRoles } from '../../auth/decorators/auth-roles.decorators';
import { USER_ROLES } from '@app/constants';
import { BID_TODO_STATUS } from '../constants';

@Controller('bids/:bidId/todos')
export class BidsTodosController {
  @HttpCode(HttpStatus.OK)
  @AuthRoles(USER_ROLES.STATION_WORKER)
  @Post(
    `/:todoId/:status(${BID_TODO_STATUS.IN_WORK}|${BID_TODO_STATUS.COMPLETED}|${BID_TODO_STATUS.PENDING})`,
  )
  async setBidTodosStatus(): Promise<any> {
    //
  }
}
