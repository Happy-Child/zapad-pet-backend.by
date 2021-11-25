import { UserEntity } from '@app/entities';
import { Expose, plainToClass } from 'class-transformer';
import { USER_ROLES } from '@app/constants';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { ShortUserDTO } from '@app/dtos';

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

export class ShortDistrictLeaderMemberDTO extends ShortUserDTO {
  constructor(data: ShortDistrictLeaderMemberDTO) {
    super(data);
  }
}
