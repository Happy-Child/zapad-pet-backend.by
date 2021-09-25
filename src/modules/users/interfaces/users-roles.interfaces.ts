import {
  IDistrictLeaderIdentifyingFields,
  IEngineerIdentifyingFields,
  IGeneralUserFields,
  IStationWorkerIdentifyingFields,
} from './users-fields.interfaces';
import { AllowedRolesType } from '../types';

export interface IStationWorker
  extends IGeneralUserFields,
    IStationWorkerIdentifyingFields {}

export interface IDistrictLeader
  extends IGeneralUserFields,
    IDistrictLeaderIdentifyingFields {}

export interface IEngineer
  extends IGeneralUserFields,
    IEngineerIdentifyingFields {}

export interface ISimpleUser extends IGeneralUserFields {
  role: AllowedRolesType;
}
