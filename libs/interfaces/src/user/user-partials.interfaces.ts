import { USER_ROLES } from '@app/constants';

export interface UserStationWorkerFields {
  role: USER_ROLES.STATION_WORKER;
  clientId: number;
}

export interface UserDistrictLeaderFields {
  role: USER_ROLES.DISTRICT_LEADER;
  districtId: number;
}

export interface UserEngineerFields {
  role: USER_ROLES.ENGINEER;
  districtId: number;
}

export interface UserStationWorkerOrDistrictLeaderOrEngineerFields {
  role:
    | USER_ROLES.STATION_WORKER
    | USER_ROLES.DISTRICT_LEADER
    | USER_ROLES.ENGINEER;
  clientId?: number;
  districtId?: number;
}
