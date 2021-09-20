import { ValidationError } from 'class-validator';
import { IErrorDetailItem } from '@app/exceptions/interfaces/exceptions-general.interfaces';

export interface IPipeValidationDecoratorOptions {
  getFormattedErrors?: (rawErrors: ValidationError[]) => IErrorDetailItem[];
}
