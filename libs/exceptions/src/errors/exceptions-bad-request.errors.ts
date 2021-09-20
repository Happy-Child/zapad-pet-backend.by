import { ExceptionsGeneralErrors } from '@app/exceptions/errors/exceptions-general.errors';

export class ExceptionsBadRequest extends ExceptionsGeneralErrors {
  defaultError = [
    {
      field: '',
      messages: ['Bad Request'],
    },
  ];
}
