import { IAbstractError, IErrorDetailItem } from '@app/exceptions/interfaces';
import { BadRequestException } from '@nestjs/common';
import { ENTITIES_FIELDS } from '@app/constants';

const defaultErrors = [
  {
    field: ENTITIES_FIELDS.UNKNOWN,
    messages: ['Bad Request'],
  },
];

export class ExceptionsBadRequest
  extends BadRequestException
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
