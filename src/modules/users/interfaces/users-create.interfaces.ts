import {
  UserDistrictLeader,
  UserEngineer,
  UserStationWorker,
} from '@app/interfaces/users/users-roles.interfaces';
import { GeneralCreateUserFields } from '@app/interfaces/users/users-general.interfaces';

export interface UsersCreateStationWorker
  extends UserStationWorker,
    GeneralCreateUserFields {}

export interface UsersCreateDistrictLeader
  extends UserDistrictLeader,
    GeneralCreateUserFields {}

export interface UsersCreateEngineer
  extends UserEngineer,
    GeneralCreateUserFields {}
