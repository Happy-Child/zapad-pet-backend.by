import { isNull, isObject } from '@app/helpers';

export const isValidException = (exception: any): boolean =>
  isObject(exception) && !isNull(exception) && 'details' in exception;
