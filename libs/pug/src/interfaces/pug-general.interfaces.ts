interface IDefaultTemplateVariables {
  href: string;
}

export interface IConfirmingRegistrationVariables
  extends IDefaultTemplateVariables {
  name: string;
}

export type IPasswordRecoveryVariables = IDefaultTemplateVariables;
