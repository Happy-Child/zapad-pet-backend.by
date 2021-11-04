import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import {
  ExceptionsNotFound,
  ExceptionsUnprocessableEntity,
} from '@app/exceptions/errors';
import { StationsRepository } from '../../repositories';
import { StationWorkerEntity } from '@app/entities';
import { StationExtendedDTO } from '../../dtos';
import { STATIONS_ERRORS } from '../../constants';

@Injectable()
export class StationsGeneralCheckingService {
  constructor(private readonly stationsRepository: StationsRepository) {}

  public async allStationsExistsOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
    exceptionByField = 'id',
  ): Promise<NonEmptyArray<StationExtendedDTO>> {
    const ids = items.map(({ id }) => id) as NonEmptyArray<number>;

    const foundRecords = await this.stationsRepository
      .createQueryBuilder('st')
      .select('st.*, sw.userId as "stationWorkerId"')
      .where(`st.id IN (:...ids)`, { ids })
      .leftJoin(StationWorkerEntity, 'sw', '"sw"."stationId" = st.id')
      .orderBy(`st.id`)
      .getRawMany();

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
}
