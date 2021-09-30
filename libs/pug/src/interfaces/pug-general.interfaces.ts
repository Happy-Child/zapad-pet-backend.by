interface IDefaultTemplateVariables {
  href: string;
}

export interface IAfterCreatedUserVariables extends IDefaultTemplateVariables {
  name: string;
  password: string;
}

export type IPasswordRecoveryVariables = IDefaultTemplateVariables;
