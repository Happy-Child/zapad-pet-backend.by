import { EntityRepository } from 'typeorm';
import { DistrictEntity } from '../entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(DistrictEntity)
export class DistrictsRepository extends GeneralRepository<DistrictEntity> {
  protected entitySerializer = DistrictEntity;
}
