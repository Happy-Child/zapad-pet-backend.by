import {
  DistrictLeaderMemberDTO,
  EngineerMemberDTO,
  StationWorkerMemberDTO,
} from '../dtos';

export type TMemberDTO =
  | DistrictLeaderMemberDTO
  | EngineerMemberDTO
  | StationWorkerMemberDTO;

export type TFullMemberDTO =
  | (Omit<DistrictLeaderMemberDTO, 'leaderDistrictId'> & {
      leaderDistrictId: number;
    })
  | (Omit<EngineerMemberDTO, 'engineerDistrictId'> & {
      engineerDistrictId: number;
    })
  | (Omit<StationWorkerMemberDTO, 'clientId' | 'stationId'> & {
      clientId: number;
      stationId: number;
    });
