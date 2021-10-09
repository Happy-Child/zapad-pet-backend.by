import {
  DistrictLeaderJWTPayloadDTO,
  EngineerJWTPayloadDTO,
  SimpleUserJWTPayloadDTO,
  StationWorkerJWTPayloadDTO,
} from '../dtos';

export type GeneralJWTPayload =
  | DistrictLeaderJWTPayloadDTO
  | EngineerJWTPayloadDTO
  | StationWorkerJWTPayloadDTO
  | SimpleUserJWTPayloadDTO;
