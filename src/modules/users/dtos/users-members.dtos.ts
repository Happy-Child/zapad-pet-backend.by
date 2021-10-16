import { UserEntity } from '@app/entities';
import { USER_ROLES } from '../constants';
import { Expose, plainToClass } from 'class-transformer';
import { MembersRoles } from '../types';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';

export class DistrictLeaderMemberDTO extends UserEntity {
  @Expose()
  role!: USER_ROLES.DISTRICT_LEADER;

  @Expose()
  leaderDistrictId!: number | null;

  constructor(
    data: DistrictLeaderMemberDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    super();
    Object.assign(
      this,
      plainToClass(DistrictLeaderMemberDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class EngineerMemberDTO extends UserEntity {
  @Expose()
  role!: USER_ROLES.ENGINEER;

  @Expose()
  engineerDistrictId!: number | null;

  constructor(
    data: EngineerMemberDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    super();
    Object.assign(
      this,
      plainToClass(EngineerMemberDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class StationWorkerMemberDTO extends UserEntity {
  @Expose()
  role!: USER_ROLES.STATION_WORKER;

  @Expose()
  clientId!: number | null;

  @Expose()
  stationId!: number | null;

  constructor(
    data: StationWorkerMemberDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    super();
    Object.assign(
      this,
      plainToClass(StationWorkerMemberDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class SimpleUserDTO extends UserEntity {
  @Expose()
  role!: Exclude<USER_ROLES, MembersRoles>;

  constructor(data: SimpleUserDTO, serializeOptions?: ClassTransformOptions) {
    super();
    Object.assign(
      this,
      plainToClass(SimpleUserDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}
