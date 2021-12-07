interface IDefaultTemplateVariables {
  href: string;
}

export type IConfirmEmailVariables = IDefaultTemplateVariables;

export interface IAfterCreatedUserVariables extends IDefaultTemplateVariables {
  name: string;
  password: string;
}

export type IPasswordRecoveryVariables = IDefaultTemplateVariables;
