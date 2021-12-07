import { PUG_TEMPLATES_NAMES } from '@app/pug/constants';
import {
  IAfterCreatedUserVariables,
  IConfirmEmailVariables,
  IPasswordRecoveryVariables,
} from '@app/pug/interfaces';

export type GetPugTemplateVariablesType<T extends PUG_TEMPLATES_NAMES> =
  T extends PUG_TEMPLATES_NAMES.CONFIRM_EMAIL
    ? IConfirmEmailVariables
    : T extends PUG_TEMPLATES_NAMES.CREATE_NEW_PASSWORD
    ? IPasswordRecoveryVariables
    : T extends PUG_TEMPLATES_NAMES.AFTER_CREATED_USER
    ? IAfterCreatedUserVariables
    : void;
