import { EntityRepository } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { STATIONS_ERRORS } from '../constants/stations-errors.constants';
import { BidEntity, StationEntity, StationWorkerEntity } from '@app/entities';
import { NonEmptyArray } from '@app/types';
import { StationDTO } from '../dtos';
import { BID_STATUTES_NEEDING_FROM_STATION_WORKER } from '../../bids/constants';

@EntityRepository(StationEntity)
export class StationsRepository extends GeneralRepository<StationEntity> {
  protected entitySerializer = StationEntity;

  public async stationsNumbersNotExistsOrFail(
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

  public async getStationsOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
  ): Promise<NonEmptyArray<StationDTO>> {
    const ids = items.map(({ id }) => id) as NonEmptyArray<number>;

    const records = await this.createQueryBuilder('st')
      .select('st.*, sw.userId as "stationWorkerId"')
      .where(`st.id IN (:...ids)`, { ids })
      .leftJoin(StationWorkerEntity, 'sw', '"sw"."stationId" = st.id')
      .orderBy(`st.id`)
      .getRawMany();

    const allIdsExists = records.length === ids.length;

    if (allIdsExists) {
      return records as NonEmptyArray<StationDTO>;
    }

    const recordsIds = records.map(({ id }) => id);
    const result = items.filter((item) => !recordsIds.includes(item.id));

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: 'id',
      messages: [STATIONS_ERRORS.STATION_NOT_FOUND],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  public async getStationsWithCountBidsOfNeedingWorkers(
    ids: NonEmptyArray<number>,
  ): Promise<{ id: number; count: number }[]> {
    return this.createQueryBuilder('st')
      .select('st.id as id, COUNT(b.id)::int AS count')
      .where('st.id IN (:...ids)', { ids })
      .leftJoin(
        BidEntity,
        'b',
        `"b"."stationId" = st.id AND b.status IN (:...statuses)`,
        { statuses: BID_STATUTES_NEEDING_FROM_STATION_WORKER },
      )
      .groupBy('st.id')
      .getRawMany();
  }
}
