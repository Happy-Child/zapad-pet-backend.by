import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { generalPrepareErrorsToException } from '@app/exceptions/helpers';
import {
  IErrorDetailItem,
  IPipeValidationDecoratorOptions,
} from '@app/exceptions/interfaces';
import { ExceptionsBadRequest } from '@app/exceptions/errors';
import { PIPE_VALIDATION_OPTIONS_DECORATOR } from '@app/exceptions/constants';

@Injectable()
export class ExceptionsAppValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype || !this.canValidate(metatype)) {
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

  private getFormattedErrors(
    metatype: any,
    rawErrors: ValidationError[],
  ): IErrorDetailItem[] {
    const options: IPipeValidationDecoratorOptions = Reflect.getMetadata(
      PIPE_VALIDATION_OPTIONS_DECORATOR,
      metatype,
    );

    return options && options.getFormattedErrors
      ? options.getFormattedErrors(rawErrors)
      : generalPrepareErrorsToException(rawErrors);
  }

  private canValidate(metatype: any): boolean {
    const types = [String, Boolean, Number, Array, Object];
    return !types.includes(metatype);
  }
}
