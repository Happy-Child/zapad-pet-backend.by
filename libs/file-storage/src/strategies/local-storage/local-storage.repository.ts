import { GeneralRepository } from '@app/repositories';
import { LocalStorageEntity } from '@app/entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(LocalStorageEntity)
export class LocalStorageRepository extends GeneralRepository<LocalStorageEntity> {
  protected entitySerializer = LocalStorageEntity;
}
