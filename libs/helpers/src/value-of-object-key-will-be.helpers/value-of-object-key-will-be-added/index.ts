import { isNull } from '../../types-checking.helpers';

export const valueOfObjectKeyWillBeAdded = <T>(
  next: T,
  prev: Partial<T>,
  field: keyof T,
  typeOfFieldValue = 'number',
): boolean => {
  const nextValue = next[field];
  const prevValue = prev[field];
  return isNull(prevValue) && typeof nextValue === typeOfFieldValue;
};
