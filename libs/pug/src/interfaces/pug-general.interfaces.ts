interface DefaultTemplateVariables {
  href: string;
}

export interface ConfirmingRegistrationVariables
  extends DefaultTemplateVariables {
  name: string;
}

export type PasswordRecoveryVariables = DefaultTemplateVariables;
