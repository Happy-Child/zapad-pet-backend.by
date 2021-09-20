import { ValidationError } from 'class-validator';
import { ErrorDetailItem } from '@app/exceptions/interfaces/exceptions-general.interfaces';

export interface PipeValidationDecoratorOptions {
  getFormattedErrors?: (rawErrors: ValidationError[]) => ErrorDetailItem[];
}
