import {
  ClientMembersOrStationWorkerRolesType,
  ClientMembersRolesType,
} from '../types';
import { USER_ROLES } from '../constants';

export interface IGeneralUserFields {
  name: string;
  email: string;
}

export interface IStationWorkerIdentifyingFields {
  role: USER_ROLES.STATION_WORKER;
  clientId: number;
}

export interface IDistrictLeaderIdentifyingFields {
  role: USER_ROLES.DISTRICT_LEADER;
  districtId: number;
}

export interface IEngineerIdentifyingFields {
  role: USER_ROLES.ENGINEER;
  districtId: number;
}

export interface IClientMemberIdentifyingFields {
  role: ClientMembersRolesType;
  districtId: number;
}

export interface IClientMemberOrStationWorkerIdentifyingFields {
  role: ClientMembersOrStationWorkerRolesType;
  clientId?: number;
  districtId?: number;
}
