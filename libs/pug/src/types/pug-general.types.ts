import { PUG_TEMPLATES_NAMES } from '@app/pug/constants';
import {
  ConfirmingRegistrationVariables,
  PasswordRecoveryVariables,
} from '@app/pug/interfaces';

export type GetPugTemplateVariablesType<T extends PUG_TEMPLATES_NAMES> =
  T extends PUG_TEMPLATES_NAMES.CONFIRMING_REGISTRATION
    ? ConfirmingRegistrationVariables
    : T extends PUG_TEMPLATES_NAMES.CREATE_NEW_PASSWORD
    ? PasswordRecoveryVariables
    : void;
