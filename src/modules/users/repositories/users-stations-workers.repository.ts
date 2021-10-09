import { EntityRepository } from 'typeorm';
import { StationWorkerEntity } from '../entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(StationWorkerEntity)
export class UsersStationsWorkersRepository extends GeneralRepository<StationWorkerEntity> {
  protected entitySerializer = StationWorkerEntity;
}
