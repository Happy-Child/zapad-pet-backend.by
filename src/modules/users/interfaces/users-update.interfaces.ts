import { IGeneralUserFields } from './users-fields.interfaces';
import { IDistrictLeader, IEngineer } from './users-roles.interfaces';

export interface IUsersUpdateGeneralUser extends Partial<IGeneralUserFields> {
  id: number;
}

export interface IUsersUpdateDistrictLeader extends Partial<IDistrictLeader> {
  id: number;
}

export interface IUsersUpdateUserEngineer extends Partial<IEngineer> {
  id: number;
}
