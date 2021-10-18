import { GeneralRepository } from '@app/repositories';
import { AggrStationBidStatusCountEntity } from '@app/entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(AggrStationBidStatusCountEntity)
export class AggrStationBidStatusCountRepository extends GeneralRepository<AggrStationBidStatusCountEntity> {
  protected entitySerializer = AggrStationBidStatusCountEntity;
}
