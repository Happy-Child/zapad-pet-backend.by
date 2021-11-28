import { Injectable } from '@nestjs/common';
import { IFileStorageStrategy, IRawFile } from '@app/file-storage/interfaces';
import { DropboxStorageRepository } from './dropbox-storage.repository';

@Injectable()
export class DropboxStorageStrategy implements IFileStorageStrategy {
  constructor(
    private readonly dropboxStorageRepository: DropboxStorageRepository,
  ) {}

  public async uploadFile(rawFile: IRawFile) {
    //
  }
}
