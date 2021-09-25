import { EntityRepository } from 'typeorm';
import { DistrictsToEngineersEntity } from '../entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(DistrictsToEngineersEntity)
export class DistrictsToEngineersRepository extends GeneralRepository<DistrictsToEngineersEntity> {
  protected entitySerializer = DistrictsToEngineersEntity;
}
