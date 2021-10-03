import { ENTITIES_FIELDS } from '@app/entities';
import { IAbstractError, IErrorDetailItem } from '@app/exceptions/interfaces';
import { NotFoundException } from '@nestjs/common';

const defaultErrors = [
  {
    field: ENTITIES_FIELDS.UNKNOWN,
    messages: ['Not found'],
  },
];

export class ExceptionsNotFound
  extends NotFoundException
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
