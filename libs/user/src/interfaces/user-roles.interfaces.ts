import { IGeneralUserFields, USER_ROLES } from '@app/user';

export interface IUserStationWorker extends IGeneralUserFields {
  role: USER_ROLES.STATION_WORKER;
  clientId: number;
}

export interface IUserDistrictLeader extends IGeneralUserFields {
  role: USER_ROLES.DISTRICT_LEADER;
  districtId: number;
}

export interface IUserEngineer extends IGeneralUserFields {
  role: USER_ROLES.ENGINEER;
  districtId: number;
}

export interface IUserAccountant extends IGeneralUserFields {
  role: USER_ROLES.ACCOUNTANT;
}
