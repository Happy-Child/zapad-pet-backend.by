import { USER_ROLES } from '@app/user';

export class AuthJwtPayloadDTO {
  id!: number;
  role!: USER_ROLES;
}
