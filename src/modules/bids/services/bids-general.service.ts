import { Injectable } from '@nestjs/common';
import { BidsRepository, BidsTodosRepository } from '../repositories';
import { Connection } from 'typeorm';
import { BIDS_ERRORS, USER_ROLES } from '@app/constants';
import {
  ExceptionsNotFound,
  ExceptionsUnprocessableEntity,
} from '@app/exceptions/errors';
import { BidEntity, BidTodoEntity } from '@app/entities';
import { TJwtPayloadDTO } from '../../auth/types';

const DEFAULT_BID_NOT_FOUND_ERROR = {
  type: ExceptionsNotFound,
  messages: [
    {
      field: 'id',
      messages: [BIDS_ERRORS.BID_NOT_FOUND],
    },
  ],
};

@Injectable()
export class BidsGeneralService {
  constructor(
    private readonly connection: Connection,
    private readonly bidsRepository: BidsRepository,
    private readonly bidsTodosRepository: BidsTodosRepository,
  ) {}

  public async getBidByDistrictOrFail(
    bidId: number,
    districtId: number,
  ): Promise<BidEntity> {
    const bid = await this.bidsRepository.getOneOrFail(
      { id: bidId },
      {
        repository: { relations: ['station'] },
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

    if (bid.station!.districtId !== districtId) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: 'id',
          messages: [BIDS_ERRORS.BID_LOCATED_AT_STATION_IN_ANOTHER_DISTRICT],
        },
      ]);
    }

    return bid;
  }

  public async getBidByRoleOrFail(
    bidId: number,
    user: TJwtPayloadDTO,
  ): Promise<BidEntity> {
    switch (user.role) {
      case USER_ROLES.ENGINEER:
        return await this.bidsRepository.getOneOrFail(
          { id: bidId, engineerId: user.userId },
          {
            exception: DEFAULT_BID_NOT_FOUND_ERROR,
          },
        );
      case USER_ROLES.STATION_WORKER:
        return this.bidsRepository.getOneOrFail(
          { id: bidId, stationId: user.stationId },
          {
            exception: DEFAULT_BID_NOT_FOUND_ERROR,
          },
        );
      case USER_ROLES.DISTRICT_LEADER:
        return this.getBidByDistrictOrFail(bidId, user.leaderDistrictId);
    }

    return this.bidsRepository.getOneOrFail(
      { id: bidId },
      {
        exception: DEFAULT_BID_NOT_FOUND_ERROR,
      },
    );
  }

  public async getBidTodos(bidId: number): Promise<BidTodoEntity[]> {
    const todos = await this.bidsTodosRepository.getMany({
      bidId,
    });
    todos.sort((a, b) => a.id - b.id);
    return todos;
  }
}
