import { DistrictLeaderMemberDTO } from '../../districts-leaders/dtos';
import { EngineerMemberDTO } from '../../engineers/dtos';
import { StationWorkerMemberDTO } from '../../stations-workers/dtos';

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
