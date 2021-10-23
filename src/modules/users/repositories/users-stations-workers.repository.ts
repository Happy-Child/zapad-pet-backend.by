import { EntityRepository } from 'typeorm';
import { StationWorkerEntity } from '@app/entities';
import { GeneralRepository } from '@app/repositories';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { STATIONS_ERRORS } from '../../stations/constants/stations-errors.constants';
import { NonEmptyArray } from '@app/types';

@EntityRepository(StationWorkerEntity)
export class UsersStationsWorkersRepository extends GeneralRepository<StationWorkerEntity> {
  protected entitySerializer = StationWorkerEntity;

  public async getStationsWorkersOrFail(
    items: NonEmptyArray<{ stationWorkerId: number; index: number }>,
  ): Promise<StationWorkerEntity[]> {
    const ids = items.map(
      ({ stationWorkerId }) => stationWorkerId,
    ) as NonEmptyArray<number>;
    const records = await this.getManyByColumn(ids, 'userId');

    if (records.length === ids.length) {
      return records;
    }

    const recordsIds = records.map(({ userId }) => userId);
    const result = items.filter(
      (item) => !recordsIds.includes(item.stationWorkerId),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: 'stationWorkerId',
      messages: [STATIONS_ERRORS.STATION_WORKER_NOT_EXIST],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }
}
