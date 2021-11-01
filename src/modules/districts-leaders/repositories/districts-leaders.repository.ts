import { EntityRepository } from 'typeorm';
import { DistrictLeaderEntity } from '@app/entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(DistrictLeaderEntity)
export class DistrictsLeadersRepository extends GeneralRepository<DistrictLeaderEntity> {
  protected entitySerializer = DistrictLeaderEntity;
}
