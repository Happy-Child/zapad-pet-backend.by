import { USER_ROLES } from '../../users/constants';

export interface IAuthJwtPayload {
  id: number;
  role: USER_ROLES;
}
