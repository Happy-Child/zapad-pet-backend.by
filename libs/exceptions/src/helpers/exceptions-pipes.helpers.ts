import { ValidationError } from 'class-validator';
import { ErrorDetailItem } from '@app/exceptions/interfaces';

const getSingleValidationErrorMessages = ({
  property,
  constraints,
}: Required<Pick<ValidationError, 'property' | 'constraints'>>): string[] => {
  const messages: string[] = [];

  Object.keys(constraints).forEach((key) => {
    messages?.push(constraints[key].replace(property, '').trim());
  });

  return messages;
};

export const generalPrepareErrorsToException = (
  rawErrors: ValidationError[],
): ErrorDetailItem[] => {
  const result: ErrorDetailItem[] = [];

  rawErrors.forEach(({ constraints, property, children }) => {
    const item: ErrorDetailItem = {
      field: property,
    };

    if (constraints) {
      item.messages = getSingleValidationErrorMessages({
        constraints,
        property,
      });
    }

    if (children?.length) {
      item.children = generalPrepareErrorsToException(children);
    }

    result.push(item);
  });

  return result;
};
