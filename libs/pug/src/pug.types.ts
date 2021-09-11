import { PUG_TEMPLATES_NAMES } from '@app/pug/pug.constants';
import { ConfirmingRegistrationVariables } from '@app/pug/pug.interfaces';

export type GetPugTemplateVariablesType<T extends PUG_TEMPLATES_NAMES> =
  T extends PUG_TEMPLATES_NAMES.CONFIRMING_REGISTRATION
    ? ConfirmingRegistrationVariables
    : void;
