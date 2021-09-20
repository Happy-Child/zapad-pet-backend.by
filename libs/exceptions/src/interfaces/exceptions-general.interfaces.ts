export interface ErrorDetailItem {
  field: string;
  messages?: string[];
  children?: ErrorDetailItem[];
}

export interface AbstractError {
  details: ErrorDetailItem[];
}

export interface ExceptionModuleConfig {
  withValidationPipes?: boolean;
}
