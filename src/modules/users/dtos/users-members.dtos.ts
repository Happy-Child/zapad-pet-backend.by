import { UserEntity } from '@app/entities';
import { Expose, plainToClass } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { USER_ROLES } from '@app/constants';

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

export class MasterDTO extends UserEntity {
  @Expose()
  role!: USER_ROLES.MASTER;

  constructor(data: AccountantDTO, serializeOptions?: ClassTransformOptions) {
    super();
    Object.assign(
      this,
      plainToClass(AccountantDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class AccountantDTO extends UserEntity {
  @Expose()
  role!: USER_ROLES.ACCOUNTANT;

  constructor(data: AccountantDTO, serializeOptions?: ClassTransformOptions) {
    super();
    Object.assign(
      this,
      plainToClass(AccountantDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}
