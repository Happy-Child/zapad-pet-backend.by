import { ValidateBy } from 'class-validator';
import { isObject } from '@app/helpers';

const VALIDATION_NAME = 'ARRAY_WITH_OBJECTS';
const DEFAULT_ERROR_MESSAGE = 'ARRAY_SHOULD_BE_CONTAINS_ONLY_OBJECTS';

const identifier = (arr: any): boolean => {
  if (!arr || !Array.isArray(arr)) return false;
  return arr.every((item) => isObject(item));
};

export function ArrayWithObjects(errorMessage?: string): PropertyDecorator {
  return ValidateBy({
    name: VALIDATION_NAME,
    validator: {
      validate: (value): boolean => identifier(value),
      defaultMessage: () => errorMessage || DEFAULT_ERROR_MESSAGE,
    },
  });
}
