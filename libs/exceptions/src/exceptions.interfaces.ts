export interface ErrorDetailItem {
  value?: number | string;
  field: string;
  message: string;
}

export interface AbstractError {
  details: ErrorDetailItem[];
}

export interface ExceptionModuleConfig {
  withValidationPipes?: boolean;
}
