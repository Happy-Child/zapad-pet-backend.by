import { ARRAY_UNIQUE, ValidateBy } from 'class-validator';
import { getUniquePrimitiveArray } from '@app/helpers';

const uniqueArrayByFieldsIdentifier = <T>(
  arr: T[],
  fields: (keyof T)[],
): boolean => {
  const arrayWithFullItems = arr.filter((item: any) =>
    fields.every((fieldName) => Object.keys(item).includes(String(fieldName))),
  );

  if (!arrayWithFullItems.length) return true;

  const concatFieldsValues = arrayWithFullItems.map((item) => {
    const values = fields.map((fieldName) => item[fieldName]);
    return values.join('-');
  });

  const arrayOfUniqueFieldsValues = getUniquePrimitiveArray(concatFieldsValues);

  return arrayWithFullItems.length === arrayOfUniqueFieldsValues.length;
};

interface UniqueArrayByFieldsOptions {
  message: string;
}
export function UniqueArrayByFields<T>(
  fields: (keyof T)[],
  { message }: UniqueArrayByFieldsOptions,
): PropertyDecorator {
  return ValidateBy({
    name: ARRAY_UNIQUE,
    validator: {
      validate: (value): boolean =>
        uniqueArrayByFieldsIdentifier(value as T[], fields),
      defaultMessage: () => message,
    },
  });
}
