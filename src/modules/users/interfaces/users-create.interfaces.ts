import {
  IGeneralCreateUserFields,
  IUserDistrictLeader,
  IUserEngineer,
  IUserStationWorker,
} from '@app/user';

export interface IUsersCreateStationWorker
  extends IUserStationWorker,
    IGeneralCreateUserFields {}

export interface IUsersCreateDistrictLeader
  extends IUserDistrictLeader,
    IGeneralCreateUserFields {}

export interface IUsersCreateEngineer
  extends IUserEngineer,
    IGeneralCreateUserFields {}
