import { ExceptionsGeneralErrors } from '@app/exceptions/errors/exceptions-general.errors';

export class ExceptionsUnauthorized extends ExceptionsGeneralErrors {
  defaultError = [
    {
      field: '',
      message: 'Unauthorized',
    },
  ];
}
