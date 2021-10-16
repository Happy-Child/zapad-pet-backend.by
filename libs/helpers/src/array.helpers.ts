import { NonEmptyArray } from '@app/types';

export const getUniquePrimitiveArray = <T = string | number>(
  arr: NonEmptyArray<T>,
): NonEmptyArray<T> => Array.from(new Set(arr)) as NonEmptyArray<T>;

export const getItemsByUniqueField = <T>(
  fieldName: keyof T,
  array: NonEmptyArray<T>,
): NonEmptyArray<Required<T>[keyof T]> => {
  const arr = array.map((item) => item[fieldName]);
  const finalArr = arr.filter((a) => a) as unknown as NonEmptyArray<
    Required<T>[keyof T]
  >;
  return getUniquePrimitiveArray(finalArr);
};

export const toObjectByField = <T>(
  field: keyof T,
  arr: T[],
): Record<string, T> =>
  arr.reduce((map, item) => ({ ...map, [String(item[field])]: item }), {});

export const getIndexedArray = <T>(
  arr: NonEmptyArray<T>,
): NonEmptyArray<T & { index: number }> =>
  arr.map((item, index) => ({ ...item, index })) as NonEmptyArray<
    T & { index: number }
  >;

export const isNonEmptyArray = <T>(arr: T[]): arr is NonEmptyArray<T> =>
  arr.length > 0;
