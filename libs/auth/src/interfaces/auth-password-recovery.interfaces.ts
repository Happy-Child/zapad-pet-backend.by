export interface IPasswordRecovery {
  id: number;
  email: string;
  token: string;
  attemptCount: number;
  createdAt?: Date;
  updatedAt: Date;
}
