import { DynamicModule, Module, Provider } from '@nestjs/common';
import {
  DEFAULT_FILE_STORAGE_STRATEGY,
  FILE_STORAGE_PROVIDER_KEY,
  FILE_STORAGE_STRATEGY,
} from '@app/file-storage/constants';
import { DropboxStorageModule } from './strategies/dropbox-storage';
import { LocalStorageModule } from './strategies/local-storage';
import { FileStorageGeneralService } from '@app/file-storage/services';
import { FileStorageController } from '@app/file-storage/controllers/file-storage.controller';

@Module({})
export class FileStorageModule {
  static forRoot(
    strategyType: FILE_STORAGE_STRATEGY = DEFAULT_FILE_STORAGE_STRATEGY,
  ): DynamicModule {
    const providers: Provider[] = [FileStorageGeneralService];
    const controllers: any[] = [FileStorageController];
    const imports: DynamicModule[] = [];

    switch (strategyType) {
      case FILE_STORAGE_STRATEGY.DROPBOX:
        imports.push(DropboxStorageModule.forRoot(FILE_STORAGE_PROVIDER_KEY));
        break;
      default:
        imports.push(LocalStorageModule.forRoot(FILE_STORAGE_PROVIDER_KEY));
    }

    return {
      module: FileStorageModule,
      providers,
      controllers,
      exports: providers,
      imports,
    };
  }
}
