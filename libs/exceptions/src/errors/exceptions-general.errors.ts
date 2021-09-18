import { BadRequestException } from '@nestjs/common';
import { AbstractError, ErrorDetailItem } from '@app/exceptions/interfaces';

export class ExceptionsGeneralErrors
  extends BadRequestException
  implements AbstractError
{
  defaultError: ErrorDetailItem[] = [
    {
      field: '',
      message: 'Unknown error',
    },
  ];

  private readonly _details: ErrorDetailItem[];

  constructor(details?: ErrorDetailItem[]) {
    super();
    this._details = details || this.defaultError;
  }

  get details() {
    return this._details;
  }
}
