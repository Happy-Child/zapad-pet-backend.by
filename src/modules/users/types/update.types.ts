import { USER_ROLES } from '@app/constants';

export type UsersUpdateRolesType =
  | USER_ROLES.ENGINEER
  | USER_ROLES.DISTRICT_LEADER;
