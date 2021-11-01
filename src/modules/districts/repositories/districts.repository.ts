import { EntityRepository } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import { DistrictEntity } from '@app/entities';

@EntityRepository(DistrictEntity)
export class DistrictsRepository extends GeneralRepository<DistrictEntity> {
  protected entitySerializer = DistrictEntity;
}
