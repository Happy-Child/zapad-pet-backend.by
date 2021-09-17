import { USER_ROLES } from '@app/constants';
import { ClientMembersOrStationWorkerRolesType } from '@app/types';

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

export interface UserClientMemberOrStationWorkerFields {
  role: ClientMembersOrStationWorkerRolesType;
  clientId?: number;
  districtId?: number;
}
