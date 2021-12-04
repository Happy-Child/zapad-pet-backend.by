import { Injectable } from '@nestjs/common';
import { BidsRepository, BidsTodosRepository } from '../repositories';
import { BidsUpdateBodyDTO, BidsUpdateTodoDTO } from '../dtos';
import { Connection } from 'typeorm';
import { BID_STATUS, BID_STATUS_ALLOWING_UPDATES } from '../constants';
import { isNonEmptyArray, isUndefined } from '@app/helpers';
import { ExceptionsForbidden } from '@app/exceptions/errors';
import { BidEntity } from '@app/entities';
import { BIDS_ERRORS } from '@app/constants';
import { BidsGeneralService } from './bids-general.service';
import { getBidTodosToFirstSave } from '../helpers/bids-todos.helpers';
import { StationWorkerMemberJWTPayloadDTO } from '../../auth/dtos';

@Injectable()
export class BidsUpdateService {
  constructor(
    private readonly connection: Connection,
    private readonly bidsRepository: BidsRepository,
    private readonly bidsGeneralService: BidsGeneralService,
  ) {}

  async executeOrFail(
    bidId: number,
    worker: StationWorkerMemberJWTPayloadDTO,
    body: BidsUpdateBodyDTO,
  ): Promise<void> {
    const bid = await this.bidsGeneralService.getBidByRoleOrFail(bidId, worker);

    if (bid.status !== BID_STATUS.EDITING) {
      throw new ExceptionsForbidden([
        {
          field: '',
          messages: [BIDS_ERRORS.INVALID_BID_STATUS_FOR_UPDATING],
        },
      ]);
    }

    await this.connection.transaction(async (manager) => {
      const bidsRepository = manager.getCustomRepository(BidsRepository);
      await this.updateBid(bid, body, bidsRepository);

      if (isUndefined(body.todos)) return;

      const bidsTodosRepository =
        manager.getCustomRepository(BidsTodosRepository);
      await this.updateBidTodos(bidId, body.todos, bidsTodosRepository);
    });
  }

  private async updateBid(
    curBid: BidEntity,
    { priority, deadlineAt, description }: BidsUpdateBodyDTO,
    repository: BidsRepository,
  ): Promise<void> {
    const bid = Object.assign({}, curBid);
    bid.status = BID_STATUS_ALLOWING_UPDATES;

    if (priority) bid.priority = priority;
    if (deadlineAt) bid.deadlineAt = deadlineAt;
    if (description) bid.description = description;

    await repository.saveEntity(bid);
  }

  private async updateBidTodos(
    bidId: number,
    newTodos: BidsUpdateTodoDTO[],
    repository: BidsTodosRepository,
  ): Promise<void> {
    await repository.deleteEntity({ bidId });
    const records = isNonEmptyArray(newTodos)
      ? getBidTodosToFirstSave(newTodos).map((todo) => ({
          ...todo,
          bidId,
        }))
      : [];
    await repository.saveEntities(records);
  }
}
