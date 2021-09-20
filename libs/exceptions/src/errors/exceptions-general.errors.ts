import { BadRequestException } from '@nestjs/common';
import { IAbstractError, IErrorDetailItem } from '@app/exceptions/interfaces';
import { ENTITIES_FIELDS } from '@app/entities';

export class ExceptionsGeneralErrors
  extends BadRequestException
  implements IAbstractError
{
  defaultError: IErrorDetailItem[] = [
    {
      field: ENTITIES_FIELDS.UNKNOWN,
      messages: ['Unknown error'],
    },
  ];

  private readonly _details: IErrorDetailItem[];

  constructor(details?: IErrorDetailItem[]) {
    super();
    this._details = details || this.defaultError;
  }

  get details() {
    return this._details;
  }
}
