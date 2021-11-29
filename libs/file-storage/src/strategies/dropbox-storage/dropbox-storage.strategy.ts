import { Injectable } from '@nestjs/common';
import { IFileStorageStrategy, IRawFile } from '@app/file-storage/interfaces';
import { DropboxStorageRepository } from './dropbox-storage.repository';
import { FileStorageEntity } from '@app/entities';

@Injectable()
export class DropboxStorageStrategy implements IFileStorageStrategy {
  constructor(
    private readonly dropboxStorageRepository: DropboxStorageRepository,
  ) {}

  public async uploadFile(rawFile: IRawFile): Promise<FileStorageEntity> {
    // TODO impl
    return new FileStorageEntity();
  }

  public async deleteFile(storageFileId: number): Promise<true> {
    // TODO impl
    return true;
  }
}
