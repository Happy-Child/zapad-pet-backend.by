import {
  IGeneralUserFields,
  IUserDistrictLeader,
  IUserEngineer,
} from '@app/user';

export interface IUsersUpdateGeneralUser extends Partial<IGeneralUserFields> {
  id: number;
}

export interface IUsersUpdateDistrictLeader
  extends Partial<IUserDistrictLeader> {
  id: number;
}

export interface IUsersUpdateUserEngineer extends Partial<IUserEngineer> {
  id: number;
}
