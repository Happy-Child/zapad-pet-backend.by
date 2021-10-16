import { EntityRepository } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { STATIONS_ERRORS } from '../constants/stations-errors.constants';
import { StationEntity } from '@app/entities';
import { NonEmptyArray } from '@app/types';

@EntityRepository(StationEntity)
export class StationsRepository extends GeneralRepository<StationEntity> {
  protected entitySerializer = StationEntity;

  public async stationsNumbersEmptyOrFail(
    items: NonEmptyArray<{ number: string; index: number }>,
  ): Promise<void> {
    const stationsNumbers = items.map(
      ({ number }) => number,
    ) as NonEmptyArray<string>;
    const existingStations = await this.getManyByColumn(
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
}
