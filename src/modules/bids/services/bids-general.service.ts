import { Injectable } from '@nestjs/common';
import { BidsRepository } from '../repositories';
import { Connection } from 'typeorm';
import { BIDS_ERRORS } from '@app/constants';
import {
  ExceptionsNotFound,
  ExceptionsUnprocessableEntity,
} from '@app/exceptions/errors';
import { BidEntity } from '@app/entities';

@Injectable()
export class BidsGeneralService {
  constructor(
    private readonly connection: Connection,
    private readonly bidsRepository: BidsRepository,
  ) {}

  public async getBidByStationIdOrFail(
    bidId: number,
    stationId: number,
  ): Promise<BidEntity> {
    return this.bidsRepository.getOneOrFail(
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
  }

  public async bidExistOnDistrictOrFail(
    bidId: number,
    leaderDistrictId: number,
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

    if (bid.station!.districtId !== leaderDistrictId) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: 'id',
          messages: [BIDS_ERRORS.BID_LOCATED_AT_STATION_IN_ANOTHER_DISTRICT],
        },
      ]);
    }

    return bid;
  }

  public async bidExistByEngineerOrFail(
    bidId: number,
    engineerId: number,
  ): Promise<BidEntity> {
    return await this.bidsRepository.getOneOrFail(
      { id: bidId, engineerId },
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
  }
}
