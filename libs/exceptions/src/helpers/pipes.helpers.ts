import { ValidationError } from 'class-validator';
import { ErrorDetailItem } from '@app/exceptions';

export const prepareErrorsFromPipes = (
  rawErrors: ValidationError[],
): ErrorDetailItem[] => {
  const result: ErrorDetailItem[] = [];

  rawErrors.forEach(({ property, constraints }) => {
    Object.keys(constraints).forEach((key) => {
      result.push({
        field: property,
        message: constraints[key].replace(property, '').trim(),
      });
    });
  });

  return result;
};
