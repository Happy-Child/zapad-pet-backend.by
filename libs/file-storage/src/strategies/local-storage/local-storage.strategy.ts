import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { IFileStorageStrategy, IRawFile } from '@app/file-storage/interfaces';
import { LocalStorageRepository } from './local-storage.repository';
import { FILE_STORAGE } from 'config';
import { getFileNameForSave, saveFile } from '@app/helpers';
import { FileStorageRepository } from '@app/file-storage/repositories';
import { FileStorageEntity } from '@app/entities';

@Injectable()
export class LocalStorageStrategy implements IFileStorageStrategy {
  constructor(private readonly connection: Connection) {}

  public async uploadFile({
    originalname,
    buffer,
  }: IRawFile): Promise<FileStorageEntity> {
    const filename = getFileNameForSave(originalname);

    return await this.connection.transaction(async (manager) => {
      const localStorageRepository = manager.getCustomRepository(
        LocalStorageRepository,
      );
      const localStorageRecord = await localStorageRepository.saveEntity({
        filename,
      });

      const fileStorageRepository = manager.getCustomRepository(
        FileStorageRepository,
      );
      const fileStorageRecord = await fileStorageRepository.saveEntity({
        localId: localStorageRecord.id,
      });

      await saveFile(FILE_STORAGE.LOCAL_STORAGE_PATH, filename, buffer);

      return fileStorageRecord;
    });
  }

  public async deleteFile(storageFileId: number): Promise<any> {
    // TODO impl
  }
}
