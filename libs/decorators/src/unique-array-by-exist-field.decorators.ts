import { ValidateBy } from 'class-validator';
import { getUniquePrimitiveArray, isObject } from '@app/helpers';
import { NonEmptyArray } from '@app/types';

const VALIDATION_NAME = 'UNIQUE_ARRAY_BY_EXIST_FIELD';

const identifier = <T>(
  arr: T[] | undefined,
  field: keyof T,
  ignoreValues: any[],
): boolean => {
  if (!arr || !Array.isArray(arr)) return false;

  let itemsWithField = arr.filter((item) => isObject(item) && field in item);
  itemsWithField = itemsWithField.filter(
    (val) => !ignoreValues.includes(val[field]),
  );

  if (!itemsWithField.length) return true;

  const fieldValues = itemsWithField.map(
    (item) => item[field],
  ) as unknown as NonEmptyArray<keyof T>;

  const uniqueFieldsValues = getUniquePrimitiveArray(fieldValues);

  return uniqueFieldsValues.length === fieldValues.length;
};

export function UniqueArrayByExistField<T>(
  field: keyof T,
  errorMessage: string,
  ignoreValues: any[] = [null],
): PropertyDecorator {
  return ValidateBy({
    name: VALIDATION_NAME,
    validator: {
      validate: (value): boolean =>
        identifier(value as T[], field, ignoreValues),
      defaultMessage: () => errorMessage,
    },
  });
}
