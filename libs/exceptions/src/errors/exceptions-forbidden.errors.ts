import { IAbstractError, IErrorDetailItem } from '@app/exceptions/interfaces';
import { ForbiddenException } from '@nestjs/common';
import { ENTITIES_FIELDS } from '@app/constants';

const defaultErrors = [
  {
    field: ENTITIES_FIELDS.UNKNOWN,
    messages: ['Forbidden'],
  },
];

export class ExceptionsForbidden
  extends ForbiddenException
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
