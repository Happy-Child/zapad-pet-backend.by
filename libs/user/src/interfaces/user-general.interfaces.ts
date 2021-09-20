import { USER_ROLES } from '@app/user/constants';
import { ClientMembersOrStationWorkerRolesType } from '@app/user/types';

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: USER_ROLES;
  emailConfirmed: boolean;
  password?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IGeneralUserFields {
  name: string;
  email: string;
}

export interface IGeneralCreateUserFields {
  password: string;
  passwordConfirmation: string;
}

export interface IUserClientMemberOrStationWorkerFields {
  role: ClientMembersOrStationWorkerRolesType;
  clientId?: number;
  districtId?: number;
}
