import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { prepareErrorsFromPipes } from '@app/exceptions/helpers';
import { ErrorDetailItem } from '@app/exceptions/interfaces';
import { ExceptionsBadRequest } from '@app/exceptions/errors';

@Injectable()
export class ExceptionsAppValidationPipe implements PipeTransform {
  fnPrepareErrors(rawErrors: ValidationError[]): ErrorDetailItem[] {
    return prepareErrorsFromPipes(rawErrors);
  }

  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }

    const obj = plainToClass(metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const details = this.fnPrepareErrors(errors);
      throw new ExceptionsBadRequest(details);
    }

    return value;
  }
}
