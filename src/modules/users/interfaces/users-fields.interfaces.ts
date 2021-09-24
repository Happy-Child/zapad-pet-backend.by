import { ClientMembersOrStationWorkerRolesType } from '../types';
import { USER_ROLES } from '../constants';

export interface IGeneralUserFields {
  name: string;
  email: string;
}

export interface IGeneralCreateUserFields {
  password: string;
  passwordConfirmation: string;
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

export interface IAccountantIdentifyingFields {
  role: USER_ROLES.ACCOUNTANT;
}

export interface IClientMemberOrStationWorkerIdentifyingFields {
  role: ClientMembersOrStationWorkerRolesType;
  clientId?: number;
  districtId?: number;
}
