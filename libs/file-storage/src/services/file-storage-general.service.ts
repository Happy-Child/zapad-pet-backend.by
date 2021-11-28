import { Inject, Injectable } from '@nestjs/common';
import { FILE_STORAGE_PROVIDER_KEY } from '@app/file-storage/constants';
import { IFileStorageStrategy, IRawFile } from '@app/file-storage/interfaces';

@Injectable()
export class FileStorageGeneralService implements IFileStorageStrategy {
  constructor(
    @Inject(FILE_STORAGE_PROVIDER_KEY)
    private readonly storageStrategy: IFileStorageStrategy,
  ) {}

  public async uploadFile(rawFile: IRawFile): Promise<any> {
    return await this.storageStrategy.uploadFile(rawFile);
  }
}
