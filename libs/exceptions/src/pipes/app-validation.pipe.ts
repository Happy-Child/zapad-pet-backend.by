import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate, ValidationError } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { prepareErrorsFromPipes } from '@app/exceptions/helpers/pipes.helpers';
import { BadRequest } from '@app/exceptions/errors';
import { ErrorDetailItem } from '@app/exceptions';

@Injectable()
export class AppValidationPipe implements PipeTransform {
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
      throw new BadRequest(details);
    }

    return value;
  }
}
