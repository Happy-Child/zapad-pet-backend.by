import { registerDecorator, ValidationArguments } from 'class-validator';
import { TJwtPayloadDTO } from '../../../src/modules/auth/types';

const VALIDATION_NAME = 'VALIDATE_IF_BY_USER';
const DEFAULT_ERROR_MESSAGE = 'SHOULD_BE_VALID';

// Unused
export function ValidateIfByUser(
  execute: (user: TJwtPayloadDTO) => boolean,
  errorMessage: string = DEFAULT_ERROR_MESSAGE,
): any {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: VALIDATION_NAME,
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: { message: errorMessage },
      validator: {
        validate(value: any, args: ValidationArguments) {
          const user = Reflect.getMetadata('TEST', args.object);
          return execute(user);
        },
      },
    });
  };
}
