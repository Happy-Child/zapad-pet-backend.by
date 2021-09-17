import { USER_ROLES } from '@app/constants';

export class JwtPayloadDTO {
  id!: number;
  role!: USER_ROLES;
}
