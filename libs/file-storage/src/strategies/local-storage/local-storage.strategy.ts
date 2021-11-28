import { Injectable } from '@nestjs/common';
import { IFileStorageStrategy, IRawFile } from '@app/file-storage/interfaces';
import { LocalStorageRepository } from './local-storage.repository';

@Injectable()
export class LocalStorageStrategy implements IFileStorageStrategy {
  constructor(
    private readonly localStorageRepository: LocalStorageRepository,
  ) {}

  public async uploadFile(rawFile: IRawFile) {
    //
  }
}
