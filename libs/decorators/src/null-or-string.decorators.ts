import { ValidateBy } from 'class-validator';

const VALIDATION_NAME = 'NULL_OR_NUMBER';
const DEFAULT_ERROR_MESSAGE = 'SHOULD_BE_NULL_OR_STRING';

const identifier = (val: any): boolean => {
  return typeof val === 'string' || val === null;
};

export function NullOrString(errorMessage?: string): PropertyDecorator {
  return ValidateBy({
    name: VALIDATION_NAME,
    validator: {
      validate: (value): boolean => identifier(value),
      defaultMessage: () => errorMessage || DEFAULT_ERROR_MESSAGE,
    },
  });
}
