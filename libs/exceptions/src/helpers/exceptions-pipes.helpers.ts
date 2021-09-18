import { ValidationError } from 'class-validator';
import { ErrorDetailItem } from '@app/exceptions/interfaces';

export const prepareErrorsFromPipes = (
  rawErrors: ValidationError[],
): ErrorDetailItem[] => {
  const result: ErrorDetailItem[] = [];

  rawErrors.forEach(({ property, constraints, children }) => {
    if (constraints) {
      Object.keys(constraints).forEach((key) => {
        result.push({
          field: property,
          message: constraints[key].replace(property, '').trim(),
        });
      });
    }

    if (children) {
      const preparedChildrenErrors = prepareErrorsFromPipes(children);
      result.push(...preparedChildrenErrors);
    }
  });

  return result;
};
