export interface IEmailConfirmed {
  id: number;
  email: string;
  token: string;
  createdAt?: Date;
  updatedAt?: Date;
}
