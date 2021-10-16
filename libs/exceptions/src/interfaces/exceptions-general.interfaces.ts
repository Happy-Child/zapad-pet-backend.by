export interface IErrorDetailItem {
  field: string | number;
  messages?: string[];
  children?: IErrorDetailItem[];
}

export interface IAbstractError {
  details: IErrorDetailItem[];
}

export interface IExceptionModuleConfig {
  withValidationPipes?: boolean;
}
