import { GeneralRepository } from '@app/repositories';
import { DropboxStorageEntity } from '@app/entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(DropboxStorageEntity)
export class DropboxStorageRepository extends GeneralRepository<DropboxStorageEntity> {
  protected entitySerializer = DropboxStorageEntity;
}
