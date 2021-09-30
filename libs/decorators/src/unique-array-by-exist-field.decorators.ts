import { ARRAY_UNIQUE, ValidateBy } from 'class-validator';
import { getUniquePrimitiveArray, isObject } from '@app/helpers';

const identifier = <T>(arr: T[] | undefined, field: keyof T): boolean => {
  if (!arr || !Array.isArray(arr)) return false;

  const itemsWithField = arr.filter((item) => isObject(item) && item[field]);

  if (!itemsWithField.length) return true;

  const fieldValues = itemsWithField.map((item) => item[field]);

  const uniqueFieldsValues = getUniquePrimitiveArray(fieldValues);

  return uniqueFieldsValues.length === fieldValues.length;
};

export function UniqueArrayByExistField<T>(
  field: keyof T,
  errorMessage: string,
): PropertyDecorator {
  return ValidateBy({
    name: ARRAY_UNIQUE,
    validator: {
      validate: (value): boolean => identifier(value as T[], field),
      defaultMessage: () => errorMessage,
    },
  });
}
