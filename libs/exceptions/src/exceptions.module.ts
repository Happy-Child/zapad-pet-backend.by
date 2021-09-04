import { APP_FILTER, APP_PIPE } from '@nestjs/core';
import { DynamicModule, Module, Provider } from '@nestjs/common';
import { ValidationPipe } from '@app/exceptions/pipes/validation.pipe';
import { CommonFilter } from '@app/exceptions/filters/common.filter';
import { ExceptionModuleConfig } from '@app/exceptions/exceptions.interfaces';
import { DEFAULT_EXCEPTION_MODULE_CONFIG } from '@app/exceptions/exceptions.constants';

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
        useClass: ValidationPipe,
      });
    }

    return {
      module: ExceptionsModule,
      providers,
    };
  }
}
