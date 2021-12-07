import {
  AccountantJWTPayloadDTO,
  DistrictLeaderMemberJWTPayloadDTO,
  EngineerMemberJWTPayloadDTO,
  MasterJWTPayloadDTO,
  StationWorkerMemberJWTPayloadDTO,
} from '../dtos';

export type TMemberJwtPayloadDTO =
  | DistrictLeaderMemberJWTPayloadDTO
  | EngineerMemberJWTPayloadDTO
  | StationWorkerMemberJWTPayloadDTO;

export type TJwtPayloadDTO =
  | TMemberJwtPayloadDTO
  | MasterJWTPayloadDTO
  | AccountantJWTPayloadDTO;
