import { USER_ROLES } from '@app/constants';
import { GeneralUserFields } from './users-general.interfaces';

export interface GeneralUser extends GeneralUserFields {
  role: USER_ROLES;
  clientId?: number;
  districtId?: number;
}

export interface UserStationWorker extends GeneralUserFields {
  role: USER_ROLES.STATION_WORKER;
  clientId: number;
}

export interface UserDistrictLeader extends GeneralUserFields {
  role: USER_ROLES.DISTRICT_LEADER;
  districtId: number;
}

export interface UserEngineer extends GeneralUserFields {
  role: USER_ROLES.ENGINEER;
  districtId: number;
}

export interface UserAccountant extends GeneralUserFields {
  role: USER_ROLES.ACCOUNTANT;
}
