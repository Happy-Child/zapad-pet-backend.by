import { IUser } from '@app/user/interfaces';
import { USER_EXPOSE_PASSWORD_GROUPS, USER_ROLES } from '@app/user/constants';
import { Expose } from 'class-transformer';

@Expose()
export class SerializedUserEntity implements IUser {
  id!: number;

  name!: string;

  email!: string;

  role!: USER_ROLES;

  emailConfirmed!: boolean;

  @Expose({ groups: USER_EXPOSE_PASSWORD_GROUPS })
  password?: string;

  createdAt!: Date;

  updatedAt!: Date;
}
