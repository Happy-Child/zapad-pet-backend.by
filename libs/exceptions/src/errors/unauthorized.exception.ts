import { UnauthorizedException } from '@nestjs/common';
import { AbstractError, ErrorDetailItem } from '@app/exceptions';

const defaultError: ErrorDetailItem[] = [
  {
    field: '',
    message: 'Unauthorized',
  },
];

export class Unauthorized
  extends UnauthorizedException
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
