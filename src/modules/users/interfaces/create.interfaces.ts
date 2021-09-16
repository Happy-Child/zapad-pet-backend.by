import {
  GeneralCreateUserFields,
  GeneralUserDistrictLeader,
  GeneralUserEngineer,
  GeneralUserStationWorker,
} from '@app/interfaces';

export interface UsersCreateStationWorker
  extends GeneralUserStationWorker,
    GeneralCreateUserFields {}

export interface UsersCreateDistrictLeader
  extends GeneralUserDistrictLeader,
    GeneralCreateUserFields {}

export interface UsersCreateEngineer
  extends GeneralUserEngineer,
    GeneralCreateUserFields {}
