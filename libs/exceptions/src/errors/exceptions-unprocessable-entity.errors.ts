import { ExceptionsGeneralErrors } from '@app/exceptions/errors/exceptions-general.errors';

export class ExceptionsUnprocessableEntity extends ExceptionsGeneralErrors {
  defaultError = [
    {
      field: '',
      message: 'Unprocessable Entity',
    },
  ];
}
