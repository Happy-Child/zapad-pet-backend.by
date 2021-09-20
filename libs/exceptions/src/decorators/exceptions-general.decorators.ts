import { SetMetadata } from '@nestjs/common';
import { PIPE_VALIDATION_OPTIONS_DECORATOR } from '@app/exceptions/constants';
import { CustomDecorator } from '@nestjs/common/decorators/core/set-metadata.decorator';
import { PipeValidationDecoratorOptions } from '@app/exceptions/interfaces/exceptions-decorators.interfaces';

export function PipeValidationOptions(
  options: PipeValidationDecoratorOptions,
): CustomDecorator {
  return SetMetadata(PIPE_VALIDATION_OPTIONS_DECORATOR, options);
}
