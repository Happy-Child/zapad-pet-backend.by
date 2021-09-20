import { ExceptionsGeneralErrors } from '@app/exceptions/errors/exceptions-general.errors';
import { ENTITIES_FIELDS } from '@app/entities';

export class ExceptionsBadRequest extends ExceptionsGeneralErrors {
  defaultError = [
    {
      field: ENTITIES_FIELDS.UNKNOWN,
      messages: ['Bad Request'],
    },
  ];
}
