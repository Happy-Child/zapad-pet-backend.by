import { USER_ROLES } from '@app/constants';

export type SignUpRolesType =
  | USER_ROLES.ENGINEER
  | USER_ROLES.DISTRICT_LEADER
  | USER_ROLES.STATION_WORKER
  | USER_ROLES.ACCOUNTANT;
