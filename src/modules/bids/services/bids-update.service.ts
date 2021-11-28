import { Injectable } from '@nestjs/common';
import { BidsRepository, BidsTodosRepository } from '../repositories';
import { BidsUpdateBodyDTO, BidsUpdateTodoDTO } from '../dtos';
import { Connection } from 'typeorm';
import { BID_STATUS, BID_STATUS_ALLOWING_UPDATES } from '../constants';
import { isUndefined } from '@app/helpers';
import { ExceptionsForbidden } from '@app/exceptions/errors';
import { BidEntity } from '@app/entities';
import { BIDS_ERRORS } from '@app/constants';
import { BidsGeneralService } from './bids-general.service';

@Injectable()
export class BidsUpdateService {
  constructor(
    private readonly connection: Connection,
    private readonly bidsRepository: BidsRepository,
    private readonly bidsGeneralService: BidsGeneralService,
  ) {}

  async update(
    bidId: number,
    stationId: number,
    body: BidsUpdateBodyDTO,
  ): Promise<void> {
    const bid = await this.bidsGeneralService.getBidByStationIdOrFail(
      bidId,
      stationId,
    );

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
    await repository.saveEntities(
      newTodos.map((todo) => ({
        ...todo,
        bidId,
      })),
    );
  }
}
