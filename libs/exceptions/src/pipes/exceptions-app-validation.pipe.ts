import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { generalPrepareErrorsToException } from '@app/exceptions/helpers';
import { ErrorDetailItem } from '@app/exceptions/interfaces';
import { ExceptionsBadRequest } from '@app/exceptions/errors';
import { PIPE_VALIDATION_OPTIONS_DECORATOR } from '@app/exceptions/constants';
import { PipeValidationDecoratorOptions } from '@app/exceptions/interfaces/exceptions-decorators.interfaces';

@Injectable()
export class ExceptionsAppValidationPipe implements PipeTransform {
  private getFormattedErrors(
    metatype: any,
    rawErrors: ValidationError[],
  ): ErrorDetailItem[] {
    const options: PipeValidationDecoratorOptions = Reflect.getMetadata(
      PIPE_VALIDATION_OPTIONS_DECORATOR,
      metatype,
    );

    return options && options.getFormattedErrors
      ? options.getFormattedErrors(rawErrors)
      : generalPrepareErrorsToException(rawErrors);
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }

    const obj = plainToClass(metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const details = this.getFormattedErrors(metatype, errors);
      throw new ExceptionsBadRequest(details);
    }

    return value;
  }
}
