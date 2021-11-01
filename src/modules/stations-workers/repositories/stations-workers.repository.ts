import { EntityRepository } from 'typeorm';
import { StationWorkerEntity } from '@app/entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(StationWorkerEntity)
export class StationsWorkersRepository extends GeneralRepository<StationWorkerEntity> {
  protected entitySerializer = StationWorkerEntity;
}
