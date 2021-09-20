import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ExceptionsAppValidationPipe } from '@app/exceptions/pipes';
import { ExceptionsCommonFilter } from '@app/exceptions/filters';
import { IExceptionModuleConfig } from '@app/exceptions/interfaces';
import { DEFAULT_EXCEPTION_MODULE_CONFIG } from '@app/exceptions/constants';

@Module({})
export class ExceptionsModule {
  static forRoot({
    withValidationPipes,
  }: IExceptionModuleConfig = DEFAULT_EXCEPTION_MODULE_CONFIG): DynamicModule {
    const providers: Provider[] = [
      {
        provide: APP_FILTER,
        useClass: ExceptionsCommonFilter,
      },
    ];

    if (withValidationPipes) {
      providers.push({
        provide: APP_PIPE,
        useClass: ExceptionsAppValidationPipe,
      });
    }

    return {
      module: ExceptionsModule,
      providers,
    };
  }
}
