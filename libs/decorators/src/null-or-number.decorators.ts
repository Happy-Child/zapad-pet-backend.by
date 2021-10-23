import { ValidateBy } from 'class-validator';

const VALIDATION_NAME = 'NULL_OR_NUMBER';
const DEFAULT_ERROR_MESSAGE = 'SHOULD_BE_NULL_OR_NUMBER';

const identifier = (val: any): boolean => {
  return typeof val === 'number' || val === null;
};

export function NullOrNumber(errorMessage?: string): PropertyDecorator {
  return ValidateBy({
    name: VALIDATION_NAME,
    validator: {
      validate: (value): boolean => identifier(value),
      defaultMessage: () => errorMessage || DEFAULT_ERROR_MESSAGE,
    },
  });
}
