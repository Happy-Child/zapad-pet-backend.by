import { NonEmptyArray } from '@app/types';
import { BadRequestException } from '@nestjs/common';
import {
  getPreparedChildrenErrors,
  IGetPreparedChildrenErrorsParams,
} from '@app/helpers/prepared-errors.helpers';

export const allFieldsHasValueOrFail = <
  T extends { id: number; index: number },
>(
  items: NonEmptyArray<T>,
  field: keyof T,
  value: T[keyof T],
  exceptionType: typeof BadRequestException,
  errorsConfig: IGetPreparedChildrenErrorsParams,
): void => {
  const itemsWithInvalidValues = items.filter((item) => item[field] !== value);

  if (itemsWithInvalidValues.length === 0) return;

  const itemsWithInvalidValuesIds = itemsWithInvalidValues.map(({ id }) => id);
  const itemsForException = items.filter((item) =>
    itemsWithInvalidValuesIds.includes(item.id),
  );

  const preparedErrors = getPreparedChildrenErrors(
    itemsForException,
    errorsConfig,
  );

  throw new exceptionType(preparedErrors);
};
