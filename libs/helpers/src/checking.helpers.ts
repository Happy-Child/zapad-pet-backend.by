import { isNull } from '@app/helpers/types-checking.helpers';

export const nextItemWillAddedValue = <T>(
  next: T,
  prev: Partial<T>,
  field: keyof T,
  typeOfPrevValue = 'number',
): boolean => {
  const nextValue = next[field];
  const prevValue = prev[field];
  return isNull(prevValue) && typeof nextValue === typeOfPrevValue;
};

export const nextItemWillReplacedValue = <T>(
  next: T,
  prev: Partial<T>,
  field: keyof T,
  typeOfPrevValue = 'number',
): boolean => {
  const nextValue = next[field];
  const prevValue = prev[field];
  return (
    typeof prevValue === typeOfPrevValue && typeof nextValue === typeOfPrevValue
  );
};

export const nextItemWillDeletedValue = <T>(
  next: T,
  prev: Partial<T>,
  field: keyof T,
  typeOfPrevValue = 'number',
): boolean => {
  const nextValue = next[field];
  const prevValue = prev[field];
  return isNull(nextValue) && typeof prevValue === typeOfPrevValue;
};
