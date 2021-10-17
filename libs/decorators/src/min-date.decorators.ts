import { MIN_DATE, ValidateBy, ValidationOptions } from 'class-validator';

const DEFAULT_ERROR_MESSAGE = 'INVALID_MIN_DATE';

export function MinDateWithFormatter(
  getMinDate: () => Date,
  getDate: (val: any) => Date,
  validationOptions?: ValidationOptions,
): PropertyDecorator {
  return ValidateBy(
    {
      name: MIN_DATE,
      constraints: [getMinDate()],
      validator: {
        validate: (value): boolean =>
          getDate(value).getTime() >= getMinDate().getTime(),
        defaultMessage: () => DEFAULT_ERROR_MESSAGE,
      },
    },
    validationOptions,
  );
}
