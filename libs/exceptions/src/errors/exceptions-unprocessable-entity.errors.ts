import { ExceptionsGeneralErrors } from '@app/exceptions/errors/exceptions-general.errors';
import { ENTITIES_FIELDS } from '@app/entities';

export class ExceptionsUnprocessableEntity extends ExceptionsGeneralErrors {
  defaultError = [
    {
      field: ENTITIES_FIELDS.UNKNOWN,
      messages: ['Unprocessable Entity'],
    },
  ];
}
