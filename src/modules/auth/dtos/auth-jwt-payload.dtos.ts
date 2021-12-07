import { USER_ROLES } from '@app/constants';

export class MasterJWTPayloadDTO {
  userId!: number;

  role!: USER_ROLES.MASTER;
}

export class AccountantJWTPayloadDTO {
  userId!: number;

  role!: USER_ROLES.ACCOUNTANT;
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
