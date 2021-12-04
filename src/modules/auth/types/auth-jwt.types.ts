import {
  DistrictLeaderMemberJWTPayloadDTO,
  EngineerMemberJWTPayloadDTO,
  SimpleUserJWTPayloadDTO,
  StationWorkerMemberJWTPayloadDTO,
} from '../dtos';

export type TMemberJwtPayloadDTO =
  | DistrictLeaderMemberJWTPayloadDTO
  | EngineerMemberJWTPayloadDTO
  | StationWorkerMemberJWTPayloadDTO;

export type TJwtPayloadDTO = TMemberJwtPayloadDTO | SimpleUserJWTPayloadDTO;
