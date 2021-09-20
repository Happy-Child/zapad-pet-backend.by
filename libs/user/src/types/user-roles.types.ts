import { USER_ROLES } from '@app/user';

export type ClientMembersRolesType =
  | USER_ROLES.DISTRICT_LEADER
  | USER_ROLES.ENGINEER;

export type ClientMembersOrStationWorkerRolesType =
  | ClientMembersRolesType
  | USER_ROLES.STATION_WORKER;

export type AllowedRolesType =
  | ClientMembersOrStationWorkerRolesType
  | USER_ROLES.ACCOUNTANT;
