import { ClientMembersOrStationWorkerRolesType } from '@app/types';

export interface GeneralUserFields {
  name: string;
  email: string;
}

export interface GeneralCreateUserFields {
  password: string;
  passwordConfirmation: string;
}

export interface UserClientMemberOrStationWorkerFields {
  role: ClientMembersOrStationWorkerRolesType;
  clientId?: number;
  districtId?: number;
}
