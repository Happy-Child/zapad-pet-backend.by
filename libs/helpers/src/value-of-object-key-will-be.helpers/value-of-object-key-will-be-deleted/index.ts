import { isNull } from '@app/helpers';

export const valueOfObjectKeyWillBeDeleted = <T>(
  next: T,
  prev: Partial<T>,
  field: keyof T,
  typeOfFieldValue = 'number',
): boolean => {
  const nextValue = next[field];
  const prevValue = prev[field];
  return isNull(nextValue) && typeof prevValue === typeOfFieldValue;
};
