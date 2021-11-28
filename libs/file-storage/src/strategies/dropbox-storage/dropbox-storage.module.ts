import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DropboxStorageRepository } from './dropbox-storage.repository';
import { DropboxStorageStrategy } from './dropbox-storage.strategy';

@Module({})
export class DropboxStorageModule {
  static forRoot(providerKey: string): DynamicModule {
    const providers: Provider[] = [
      {
        provide: providerKey,
        useClass: DropboxStorageStrategy,
      },
    ];

    const imports: DynamicModule[] = [
      TypeOrmModule.forFeature([DropboxStorageRepository]),
    ];

    return {
      module: DropboxStorageModule,
      imports,
      providers,
      exports: providers,
    };
  }
}
