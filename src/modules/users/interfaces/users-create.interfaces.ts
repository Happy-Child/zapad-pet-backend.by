import {
  IDistrictLeader,
  IEngineer,
  ISimpleUser,
  IStationWorker,
} from './users-roles.interfaces';
import { FilteredUserForCheck } from '../types/users-general.types';

export interface IGeneralCreateUserFields {
  password: string;
  passwordConfirmation: string;
}

export interface IUsersCreateStationWorker
  extends FilteredUserForCheck<IStationWorker>,
    IGeneralCreateUserFields {}

export interface IUsersCreateDistrictLeader
  extends FilteredUserForCheck<IDistrictLeader>,
    IGeneralCreateUserFields {}

export interface IUsersCreateEngineer
  extends FilteredUserForCheck<IEngineer>,
    IGeneralCreateUserFields {}

export interface IUsersCreateSimpleUser
  extends FilteredUserForCheck<ISimpleUser>,
    IGeneralCreateUserFields {}
