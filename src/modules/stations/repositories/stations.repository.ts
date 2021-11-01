import { EntityRepository } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import { BidEntity, StationEntity } from '@app/entities';
import { NonEmptyArray } from '@app/types';
import { BID_STATUS } from '../../bids/constants';

@EntityRepository(StationEntity)
export class StationsRepository extends GeneralRepository<StationEntity> {
  protected entitySerializer = StationEntity;

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
