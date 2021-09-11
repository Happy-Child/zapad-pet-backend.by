import { UnprocessableEntityException } from '@nestjs/common';
import { AbstractError, ErrorDetailItem } from '@app/exceptions';

const defaultError: ErrorDetailItem[] = [
  {
    field: '',
    message: 'Unprocessable Entity',
  },
];

export class UnprocessableEntity
  extends UnprocessableEntityException
  implements AbstractError
{
  private readonly _details: ErrorDetailItem[];

  constructor(details: ErrorDetailItem[] = defaultError) {
    super();
    this._details = details;
  }

  get details() {
    return this._details;
  }
}
