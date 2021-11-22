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
import { StationExtendedDTO } from '../../dtos';
import {
  BID_STATUTES_BLOCKING_UPDATE_STATION,
  STATIONS_ERRORS,
} from '../../constants';

@Injectable()
export class StationsGeneralService {
  constructor(private readonly stationsRepository: StationsRepository) {}

  public async allStationsExistsOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
    exceptionByField = 'id',
  ): Promise<NonEmptyArray<StationExtendedDTO>> {
    const ids = items.map(({ id }) => id) as NonEmptyArray<number>;

    const foundRecords = await this.stationsRepository.getStationsByIds(ids);

    const allIdsExisting = ids.length === foundRecords.length;

    if (allIdsExisting) {
      return foundRecords as NonEmptyArray<StationExtendedDTO>;
    }

    const recordsIds = foundRecords.map(({ id }) => id);
    const result = items.filter((item) => !recordsIds.includes(item.id));

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: exceptionByField,
      messages: [STATIONS_ERRORS.STATION_NOT_FOUND],
    });
    throw new ExceptionsNotFound(preparedErrors);
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
