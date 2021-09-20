import { SetMetadata, CustomDecorator } from '@nestjs/common';
import { PIPE_VALIDATION_OPTIONS_DECORATOR } from '@app/exceptions/constants';
import { IPipeValidationDecoratorOptions } from '@app/exceptions/interfaces';

export function PipeValidationOptions(
  options: IPipeValidationDecoratorOptions,
): CustomDecorator {
  return SetMetadata(PIPE_VALIDATION_OPTIONS_DECORATOR, options);
}
