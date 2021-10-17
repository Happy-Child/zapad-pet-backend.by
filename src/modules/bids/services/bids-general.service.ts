import { Injectable } from '@nestjs/common';
import { BidsRepository } from '../repositories';
import {
  BidsCreateBodyDTO,
  BidsUpdateBodyDTO,
  BidsUpdateTodoDTO,
} from '../dtos';
import { Connection } from 'typeorm';
import { BidsTodosRepository } from '../repositories/bids-todos.repository';
import { AggrStationBidStatusCountRepository } from '../../stations/repositories/aggr-station-bid-status-count.repository';
import { BID_STATUS_FOR_UPDATING, BID_STATUS, BIDS_ERRORS } from '../constants';
import { isUndefined } from '@app/helpers';
import { ExceptionsNotFound } from '@app/exceptions/errors';
import { BidEntity } from '@app/entities';

@Injectable()
export class BidsGeneralService {
  constructor(
    private readonly connection: Connection,
    private readonly bidsRepository: BidsRepository,
  ) {}

  async create(body: BidsCreateBodyDTO, stationId: number): Promise<void> {
    await this.connection.transaction(async (manager) => {
      const bidsRepository = manager.getCustomRepository(BidsRepository);
      const createdBid = await bidsRepository.saveEntity({
        ...body,
        stationId,
      });

      const aggrStationRepository = manager.getCustomRepository(
        AggrStationBidStatusCountRepository,
      );
      await aggrStationRepository.incrementColumn(
        stationId,
        BID_STATUS.PENDING_ASSIGNMENT_TO_ENGINEER,
      );

      const bidsTodosRepository =
        manager.getCustomRepository(BidsTodosRepository);
      await bidsTodosRepository.saveEntities(
        body.todos.map((todo) => ({
          ...todo,
          bidId: createdBid.id,
        })),
      );
    });
  }

  async update(
    bidId: number,
    stationId: number,
    body: BidsUpdateBodyDTO,
  ): Promise<void> {
    const bid = await this.bidsRepository.getOneOrFail(
      { id: bidId, stationId },
      {
        exception: {
          type: ExceptionsNotFound,
          messages: [
            {
              field: 'id',
              messages: [BIDS_ERRORS.BID_NOT_FOUND],
            },
          ],
        },
      },
    );

    if (bid.status !== BID_STATUS_FOR_UPDATING) {
      throw new ExceptionsNotFound([
        {
          field: 'id',
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
