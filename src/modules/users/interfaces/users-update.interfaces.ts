import { GeneralUserFields } from '@app/interfaces/users/users-general.interfaces';
import {
  UserDistrictLeader,
  UserEngineer,
} from '@app/interfaces/users/users-roles.interfaces';

export interface UsersUpdateGeneralUser extends Partial<GeneralUserFields> {
  id: number;
}

export interface UsersUpdateDistrictLeader extends Partial<UserDistrictLeader> {
  id: number;
}

export interface UsersUpdateUserEngineer extends Partial<UserEngineer> {
  id: number;
}
