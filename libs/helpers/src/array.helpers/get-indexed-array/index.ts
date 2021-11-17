import { NonEmptyArray } from '@app/types';

export const getIndexedArray = <T extends object>(
  arr: NonEmptyArray<T>,
): NonEmptyArray<T & { index: number }> =>
  arr.map((item, index) => ({ ...item, index })) as NonEmptyArray<
    T & { index: number }
  >;
