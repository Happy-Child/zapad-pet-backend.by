import { UserEntity } from '@app/entities';
import { Expose, plainToClass } from 'class-transformer';
import { USER_ROLES } from '@app/constants';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { ShortUserDTO } from '@app/dtos';

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

export class ShortEngineerMemberDTO extends ShortUserDTO {
  constructor(data: Partial<ShortEngineerMemberDTO>) {
    super(data);
  }
}
