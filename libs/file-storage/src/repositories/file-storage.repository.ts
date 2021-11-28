import { GeneralRepository } from '@app/repositories';
import { FileStorageEntity } from '@app/entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(FileStorageEntity)
export class FileStorageRepository extends GeneralRepository<FileStorageEntity> {
  protected entitySerializer = FileStorageEntity;
}
