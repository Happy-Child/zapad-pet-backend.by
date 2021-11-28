import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import {
  getPreparedChildrenErrors,
  IGetPreparedChildrenErrorsParams,
} from '@app/helpers/prepared-errors.helpers';
import {
  ExceptionsNotFound,
  ExceptionsUnprocessableEntity,
} from '@app/exceptions/errors';
import { StationsRepository } from '../../repositories';
import { BID_STATUTES_BLOCKING_UPDATE_STATION } from '../../constants';
import { StationEntity } from '@app/entities';
import { ENTITIES_FIELDS, STATIONS_ERRORS } from '@app/constants';

@Injectable()
export class StationsGeneralService {
  constructor(private readonly stationsRepository: StationsRepository) {}

  public async getStationOrFail(id: number): Promise<StationEntity> {
    return await this.stationsRepository.getOneOrFail(
      { id },
      {
        repository: { relations: ['bids'] },
        exception: {
          type: ExceptionsNotFound,
          messages: [
            {
              field: ENTITIES_FIELDS.ID,
              messages: [STATIONS_ERRORS.STATION_NOT_FOUND],
            },
          ],
        },
      },
    );
  }

  public async allStationsNumbersNotExistsOrFail(
    items: NonEmptyArray<{ number: string; index: number }>,
  ): Promise<void> {
    const stationsNumbers = items.map(
      ({ number }) => number,
    ) as NonEmptyArray<string>;
    const existingStations = await this.stationsRepository.getManyByColumn(
      stationsNumbers,
      'number',
    );

    if (existingStations.length === 0) return;

    const existingStationsNumbers = existingStations.map(
      ({ number }) => number,
    );
    const result = items.filter(({ number }) =>
      existingStationsNumbers.includes(number),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: 'number',
      messages: [STATIONS_ERRORS.STATION_NUMBER_IS_EXIST],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  public async allStationsCanBeUpdateOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
    errorConfig: IGetPreparedChildrenErrorsParams = {
      field: 'id',
      messages: [STATIONS_ERRORS.STATION_CANNOT_BE_UPDATED],
    },
  ): Promise<void> {
    const ids = items.map(({ id }) => id) as NonEmptyArray<number>;

    const records =
      await this.stationsRepository.getStationsWithAggrBidsByStatuses(
        ids,
        BID_STATUTES_BLOCKING_UPDATE_STATION,
      );

    const stationsForException = items.filter((item) =>
      records.find(({ id, count }) => id === item.id && count > 0),
    );

    if (stationsForException.length) {
      const preparedErrors = getPreparedChildrenErrors(
        stationsForException,
        errorConfig,
      );
      throw new ExceptionsUnprocessableEntity(preparedErrors);
    }
  }
}
