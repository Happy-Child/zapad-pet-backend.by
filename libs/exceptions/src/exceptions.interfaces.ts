export interface ErrorDetailItem {
  field: string;
  message: string;
}

export interface AbstractError {
  details: ErrorDetailItem[];
}

export interface ExceptionModuleConfig {
  withValidationPipes?: boolean;
}
