import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { AppValidationPipe } from '@app/exceptions/pipes/app-validation.pipe';
import { CommonFilter } from '@app/exceptions/filters/common.filter';
import { ExceptionModuleConfig } from '@app/exceptions/interfaces/general.interfaces';
import { DEFAULT_EXCEPTION_MODULE_CONFIG } from '@app/exceptions/constants/general.constants';

@Module({})
export class ExceptionsModule {
  static forRoot({
    withValidationPipes,
  }: ExceptionModuleConfig = DEFAULT_EXCEPTION_MODULE_CONFIG): DynamicModule {
    const providers: Provider[] = [
      {
        provide: APP_FILTER,
        useClass: CommonFilter,
      },
    ];

    if (withValidationPipes) {
      providers.push({
        provide: APP_PIPE,
        useClass: AppValidationPipe,
      });
    }

    return {
      module: ExceptionsModule,
      providers,
    };
  }
}
