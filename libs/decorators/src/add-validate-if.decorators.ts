import { registerDecorator, ValidationArguments } from 'class-validator';

const VALIDATION_NAME = 'ADD_VALIDATE_IF';
const DEFAULT_ERROR_MESSAGE = 'SHOULD_BE_VALID';

export function AddValidateIf(
  isShouldValidate: (item: any) => boolean,
  ruleOfValidate: (val: any) => boolean,
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
          return isShouldValidate(args.object) ? ruleOfValidate(value) : true;
        },
      },
    });
  };
}
