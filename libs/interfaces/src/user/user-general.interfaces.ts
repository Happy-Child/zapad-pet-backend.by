import {
  UserDistrictLeaderFields,
  UserEngineerFields,
  UserStationWorkerFields,
} from '@app/interfaces/user/user-partials.interfaces';
import { USER_ROLES } from '@app/constants';

export interface GeneralUserFields {
  name: string;
  email: string;
}

export interface GeneralCreateUserFields {
  password: string;
  passwordConfirmation: string;
}

export interface GeneralUserStationWorker
  extends GeneralUserFields,
    UserStationWorkerFields {}

export interface GeneralUserDistrictLeader
  extends GeneralUserFields,
    UserDistrictLeaderFields {}

export interface GeneralUserEngineer
  extends GeneralUserFields,
    UserEngineerFields {}

export interface GeneralUserAccountant extends GeneralUserFields {
  role: USER_ROLES.ACCOUNTANT;
}
