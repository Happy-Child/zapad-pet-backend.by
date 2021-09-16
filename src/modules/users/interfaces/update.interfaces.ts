import {
  GeneralUserDistrictLeader,
  GeneralUserEngineer,
  GeneralUserFields,
} from '@app/interfaces';

export interface UsersUpdateGeneralUser extends Partial<GeneralUserFields> {
  id: number;
}

export interface UsersUpdateDistrictLeader
  extends Partial<GeneralUserDistrictLeader> {
  id: number;
}

export interface UsersUpdateUserEngineer extends Partial<GeneralUserEngineer> {
  id: number;
}
