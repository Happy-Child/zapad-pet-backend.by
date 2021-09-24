import { IGeneralCreateUserFields } from './users-fields.interfaces';
import {
  IDistrictLeader,
  IEngineer,
  IStationWorker,
} from './users-roles.interfaces';

export interface IUsersCreateStationWorker
  extends IStationWorker,
    IGeneralCreateUserFields {}

export interface IUsersCreateDistrictLeader
  extends IDistrictLeader,
    IGeneralCreateUserFields {}

export interface IUsersCreateEngineer
  extends IEngineer,
    IGeneralCreateUserFields {}
