import { IGeneralCreateUserFields } from './users-fields.interfaces';
import {
  IDistrictLeader,
  IEngineer,
  ISimpleUser,
  IStationWorker,
} from './users-roles.interfaces';
import { FilteredUser } from '../types/users-general.types';

export interface IUsersCreateStationWorker
  extends FilteredUser<IStationWorker>,
    IGeneralCreateUserFields {}

export interface IUsersCreateDistrictLeader
  extends FilteredUser<IDistrictLeader>,
    IGeneralCreateUserFields {}

export interface IUsersCreateEngineer
  extends FilteredUser<IEngineer>,
    IGeneralCreateUserFields {}

export interface IUsersCreateSimpleUser
  extends FilteredUser<ISimpleUser>,
    IGeneralCreateUserFields {}
