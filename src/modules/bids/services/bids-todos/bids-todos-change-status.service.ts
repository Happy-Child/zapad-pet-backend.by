import { Injectable } from '@nestjs/common';
import { BidsTodosRepository } from '../../repositories';
import { BID_STATUS, BID_TODO_STATUS } from '../../constants';
import { ExceptionsForbidden } from '@app/exceptions/errors';
import { BIDS_ERRORS, SIDE } from '@app/constants';
import { getSideRelativeItemInList } from '@app/helpers';
import { BidTodoEntity } from '@app/entities';
import { BidsGeneralService } from '../bids-general.service';
import { BidsTodosUpdateService } from './bids-todos-update.service';

const throwInvalidBidTodoStatus = () => {
  throw new ExceptionsForbidden([
    {
      field: 'status',
      messages: [BIDS_ERRORS.BID_TODO_INVALID_STATUS],
    },
  ]);
};

@Injectable()
export class BidsTodosChangeStatusService {
  constructor(
    private readonly bidsGeneralService: BidsGeneralService,
    private readonly bidsTodosRepository: BidsTodosRepository,
    private readonly bidsTodosUpdateService: BidsTodosUpdateService,
  ) {}

  public async executeOrFail(
    bidId: number,
    todoId: number,
    nextStatus: BID_TODO_STATUS.IN_WORK | BID_TODO_STATUS.COMPLETED,
    engineerUserId: number,
  ): Promise<void> {
    await this.checkBidStatusOrFail(bidId, engineerUserId);
    const todos = await this.bidTodoExistingOrFail(bidId, todoId);

    let curTodoInWork = await this.bidsTodosRepository.getOne({
      bidId,
      status: BID_TODO_STATUS.IN_WORK,
    });

    curTodoInWork = curTodoInWork || todos[0];

    const side = this.getUpdatedTodoSideOrFail(todoId, curTodoInWork.id, todos);

    this.checkNextTodoStatusBySideOrFail(curTodoInWork, nextStatus, side);
    await this.bidsTodosUpdateService.updateBidTodoBySide(
      side,
      todoId,
      nextStatus,
      todos,
    );
  }

  private async checkBidStatusOrFail(
    bidId: number,
    engineerUserId: number,
  ): Promise<void> {
    const bid = await this.bidsGeneralService.bidExistByEngineerOrFail(
      bidId,
      engineerUserId,
    );

    if (bid.status !== BID_STATUS.IN_WORK) {
      throw new ExceptionsForbidden([
        {
          field: 'id',
          messages: [BIDS_ERRORS.INVALID_BID_STATUS_FOR_CHANGE_TODO_STATUS],
        },
      ]);
    }
  }

  private async bidTodoExistingOrFail(
    bidId: number,
    todoId: number,
  ): Promise<BidTodoEntity[]> {
    const todos = await this.bidsTodosRepository.getMany({
      bidId,
    });
    todos.sort((a, b) => a.id - b.id);

    const todoExists = todos.find(({ id }) => id === todoId);
    if (!todoExists) {
      throw new ExceptionsForbidden([
        {
          field: 'todoId',
          messages: [BIDS_ERRORS.BID_TODO_NOT_FOUND],
        },
      ]);
    }

    return todos;
  }

  private getUpdatedTodoSideOrFail(
    updateTodoId: number,
    curTodoInWorkId: number,
    todos: { id: number }[],
  ): SIDE.LEFT | SIDE.MIDDLE {
    const side = getSideRelativeItemInList(
      updateTodoId,
      curTodoInWorkId,
      todos,
    );

    if (side === SIDE.RIGHT) {
      throw new ExceptionsForbidden([
        {
          field: 'todoId',
          messages: [BIDS_ERRORS.FOLLOWING_TODOS_CANNOT_BE_UPDATED],
        },
      ]);
    }

    return side as NonNullable<typeof side>;
  }

  private checkNextTodoStatusBySideOrFail(
    curTodoInWork: BidTodoEntity,
    nextStatus: BID_TODO_STATUS,
    side: SIDE.LEFT | SIDE.MIDDLE,
  ): void {
    if (curTodoInWork.status === nextStatus) {
      throwInvalidBidTodoStatus();
    }

    if (side === SIDE.LEFT && nextStatus !== BID_TODO_STATUS.IN_WORK) {
      throwInvalidBidTodoStatus();
    }
  }
}
