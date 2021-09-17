import { USER_ROLES } from '@app/constants';

export class AuthJwtPayloadDTO {
  id!: number;
  role!: USER_ROLES;
}
