import { NonEmptyArray } from '@app/types';

export const getUniquePrimitiveArray = <T = string | number>(
  arr: NonEmptyArray<T>,
): NonEmptyArray<T> => Array.from(new Set(arr)) as NonEmptyArray<T>;
