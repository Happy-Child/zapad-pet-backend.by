import {
  IAccountantIdentifyingFields,
  IDistrictLeaderIdentifyingFields,
  IEngineerIdentifyingFields,
  IGeneralUserFields,
  IStationWorkerIdentifyingFields,
} from './users-fields.interfaces';

export interface IStationWorker
  extends IGeneralUserFields,
    IStationWorkerIdentifyingFields {}

export interface IDistrictLeader
  extends IGeneralUserFields,
    IDistrictLeaderIdentifyingFields {}

export interface IEngineer
  extends IGeneralUserFields,
    IEngineerIdentifyingFields {}

export interface IAccountant
  extends IGeneralUserFields,
    IAccountantIdentifyingFields {}
