import {
  DistrictLeaderMemberDTO,
  EngineerMemberDTO,
  SimpleUserDTO,
  StationWorkerMemberDTO,
} from '../dtos';

export type TMember =
  | DistrictLeaderMemberDTO
  | EngineerMemberDTO
  | StationWorkerMemberDTO
  | SimpleUserDTO;
