import { USER_ROLES } from '@app/constants';

export type DistrictMembersRoles =
  | USER_ROLES.DISTRICT_LEADER
  | USER_ROLES.ENGINEER;

export type MembersRoles = DistrictMembersRoles | USER_ROLES.STATION_WORKER;

export type AllowedRoles = MembersRoles | USER_ROLES.ACCOUNTANT;
