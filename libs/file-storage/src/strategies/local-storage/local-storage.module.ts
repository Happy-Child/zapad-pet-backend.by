import { DynamicModule, Module, Provider } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LocalStorageRepository } from './local-storage.repository';
import { LocalStorageStrategy } from './local-storage.strategy';

@Module({})
export class LocalStorageModule {
  static forRoot(providerKey: string): DynamicModule {
    const providers: Provider[] = [
      {
        provide: providerKey,
        useClass: LocalStorageStrategy,
      },
    ];

    const imports: DynamicModule[] = [
      TypeOrmModule.forFeature([LocalStorageRepository]),
    ];

    return {
      module: LocalStorageModule,
      imports,
      providers,
      exports: providers,
    };
  }
}
