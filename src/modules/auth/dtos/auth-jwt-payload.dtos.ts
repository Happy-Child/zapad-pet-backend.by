import { USER_ROLES } from '../../users/constants';
import { MembersRoles } from '../../users/types';

export class SimpleUserJWTPayloadDTO {
  userId!: number;
  role!: Exclude<USER_ROLES, MembersRoles>;
}

export class DistrictLeaderMemberJWTPayloadDTO {
  userId!: number;

  leaderDistrictId!: number;

  role!: USER_ROLES.DISTRICT_LEADER;
}

export class EngineerMemberJWTPayloadDTO {
  userId!: number;

  engineerDistrictId!: number;

  role!: USER_ROLES.ENGINEER;
}

export class StationWorkerMemberJWTPayloadDTO {
  userId!: number;

  clientId!: number;

  stationId!: number;

  role!: USER_ROLES.STATION_WORKER;
}
