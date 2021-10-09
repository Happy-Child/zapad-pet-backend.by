import { UnauthorizedException } from '@nestjs/common';
import { IAbstractError, IErrorDetailItem } from '@app/exceptions/interfaces';
import { ENTITIES_FIELDS } from '@app/constants';

const defaultErrors = [
  {
    field: ENTITIES_FIELDS.UNKNOWN,
    messages: ['Unauthorized'],
  },
];

export class ExceptionsUnauthorized
  extends UnauthorizedException
  implements IAbstractError
{
  private readonly _details: IErrorDetailItem[];

  constructor(details?: IErrorDetailItem[]) {
    super();
    this._details = details || defaultErrors;
  }

  get details() {
    return this._details;
  }
}
