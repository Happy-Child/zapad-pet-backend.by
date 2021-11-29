import { Injectable, PipeTransform } from '@nestjs/common';
import { isUndefined } from '@app/helpers';
import { IRawFile } from '@app/file-storage/interfaces';
import { ExceptionsBadRequest } from '@app/exceptions/errors';
import { FILE_ERRORS, GENERAL_ERRORS } from '@app/constants';
import {
  DEFAULT_UPLOAD_FILE_EXTS,
  DEFAULT_UPLOAD_FILE_SIZE,
} from '@app/file-storage/constants';
import path from 'path';

const throwError = (msg: string) => {
  throw new ExceptionsBadRequest([
    {
      field: 'file',
      messages: [msg],
    },
  ]);
};

@Injectable()
export class UploadFileValidationPipe implements PipeTransform {
  constructor(
    private readonly maxSizeBytes: number = DEFAULT_UPLOAD_FILE_SIZE,
    private readonly allowedExts: string[] = DEFAULT_UPLOAD_FILE_EXTS,
  ) {}

  async transform(value: IRawFile | undefined) {
    if (isUndefined(value)) {
      throwError(GENERAL_ERRORS.REQUIRED_FIELD);
    }

    const extName = path.extname(String(value?.originalname));
    if (!this.allowedExts.includes(extName)) {
      throwError(FILE_ERRORS.INVALID_FILE_EXT);
    }

    if (Number(value?.size) > this.maxSizeBytes) {
      throwError(FILE_ERRORS.INVALID_FILE_SIZE);
    }

    return value;
  }
}
