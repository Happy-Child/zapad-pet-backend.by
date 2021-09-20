import { Expose } from 'class-transformer';
import { IPasswordRecovery } from '@app/auth/interfaces';

@Expose()
export class SerializedPasswordRecoveryEntity implements IPasswordRecovery {
  id!: number;

  email!: string;

  token!: string;

  attemptCount!: number;

  updatedAt!: Date;
}
