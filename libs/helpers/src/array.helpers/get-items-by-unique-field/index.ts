import { NonEmptyArray } from '@app/types';
import { getUniquePrimitiveArray } from '@app/helpers/array.helpers';

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
