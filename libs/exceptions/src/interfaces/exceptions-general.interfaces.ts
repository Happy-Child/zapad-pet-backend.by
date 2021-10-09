import { ENTITIES_FIELDS } from '@app/constants';

export interface IErrorDetailItem {
  field: ENTITIES_FIELDS | number;
  messages?: string[];
  children?: IErrorDetailItem[];
}

export interface IAbstractError {
  details: IErrorDetailItem[];
}

export interface IExceptionModuleConfig {
  withValidationPipes?: boolean;
}
