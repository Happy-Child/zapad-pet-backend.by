import { USER_ROLES } from '../../users/constants';
import { MembersRoles } from '../../users/types';

export class SimpleUserJWTPayloadDTO {
  sub!: number;
  role!: Exclude<USER_ROLES, MembersRoles>;
}

export class DistrictLeaderJWTPayloadDTO {
  sub!: number;
  role!: USER_ROLES.DISTRICT_LEADER;
  districtId!: number;
}

export class EngineerJWTPayloadDTO {
  sub!: number;
  role!: USER_ROLES.ENGINEER;
  districtId!: number;
}

export class StationWorkerJWTPayloadDTO {
  sub!: number;
  role!: USER_ROLES.STATION_WORKER;
  stationId!: number;
}
