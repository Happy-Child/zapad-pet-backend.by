import {
  DistrictLeaderMemberJWTPayloadDTO,
  EngineerMemberJWTPayloadDTO,
  StationWorkerMemberJWTPayloadDTO,
} from '../dtos';

export type TMemberJWTPayloadDTO =
  | DistrictLeaderMemberJWTPayloadDTO
  | EngineerMemberJWTPayloadDTO
  | StationWorkerMemberJWTPayloadDTO;
