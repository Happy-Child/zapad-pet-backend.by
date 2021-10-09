import { ValidationError } from 'class-validator';
import { IErrorDetailItem } from '@app/exceptions/interfaces';
import { ENTITIES_FIELDS } from '@app/constants';

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
): IErrorDetailItem[] => {
  const result: IErrorDetailItem[] = [];

  rawErrors.forEach(({ constraints, property, children }) => {
    const item: IErrorDetailItem = {
      field: property as ENTITIES_FIELDS,
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
