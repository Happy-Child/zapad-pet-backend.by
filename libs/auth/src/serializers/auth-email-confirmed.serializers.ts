import { Expose } from 'class-transformer';
import { IEmailConfirmed } from '@app/auth/interfaces';

@Expose()
export class SerializedEmailConfirmedEntity implements IEmailConfirmed {
  id!: number;

  email!: string;

  token!: string;
}
