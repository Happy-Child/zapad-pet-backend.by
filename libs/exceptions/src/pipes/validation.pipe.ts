import { ArgumentMetadata, Injectable, PipeTransform } from '@nestjs/common';
import { validate } from 'class-validator';
import { plainToClass } from 'class-transformer';
import { prepareErrorsFromPipes } from '@app/exceptions/helpers/pipes.helpers';
import { BadRequest } from '@app/exceptions/errors';

@Injectable()
export class ValidationPipe implements PipeTransform {
  async transform(value: any, { metatype }: ArgumentMetadata) {
    if (!metatype) {
      return value;
    }

    const obj = plainToClass(metatype, value);
    const errors = await validate(obj);

    if (errors.length) {
      const details = prepareErrorsFromPipes(errors);
      throw new BadRequest(details);
    }

    return value;
  }
}
