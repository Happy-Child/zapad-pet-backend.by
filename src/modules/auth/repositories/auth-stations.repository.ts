import { StationEntity } from '../../stations';
import { EntityRepository } from 'typeorm';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(StationEntity)
export class AuthStationsRepository extends GeneralRepository<StationEntity> {
  protected entitySerializer = StationEntity;
}
