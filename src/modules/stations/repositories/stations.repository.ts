import { EntityRepository } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import { BidEntity, StationEntity, StationWorkerEntity } from '@app/entities';
import { NonEmptyArray } from '@app/types';
import { BID_STATUS } from '../../bids/constants';
import { StationExtendedDTO } from '../dtos';

@EntityRepository(StationEntity)
export class StationsRepository extends GeneralRepository<StationEntity> {
  protected entitySerializer = StationEntity;

  public async getStationsByIds(
    ids: NonEmptyArray<number>,
  ): Promise<StationExtendedDTO[]> {
    const items = await this.createQueryBuilder('st')
      .select('st.*, sw.userId as "stationWorkerId"')
      .where(`st.id IN (:...ids)`, { ids })
      .leftJoin(
        StationWorkerEntity,
        'sw',
        '"sw"."stationId" = st.id AND "sw"."clientId" = st.clientId',
      )
      .orderBy(`st.id`)
      .getRawMany();

    return items.map((item) => new StationExtendedDTO(item));
  }

  public async getStationsWithAggrBidsByStatuses(
    ids: NonEmptyArray<number>,
    statuses: NonEmptyArray<BID_STATUS>,
  ): Promise<{ id: number; count: number }[]> {
    return this.createQueryBuilder('st')
      .select('st.id as id, COUNT(b.id)::int AS count')
      .where('st.id IN (:...ids)', { ids })
      .leftJoin(
        BidEntity,
        'b',
        `"b"."stationId" = st.id AND b.status IN (:...statuses)`,
        { statuses },
      )
      .groupBy('st.id')
      .getRawMany();
  }
}
