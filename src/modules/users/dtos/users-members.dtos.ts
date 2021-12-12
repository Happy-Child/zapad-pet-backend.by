import { UserEntity } from '@app/entities';
import { Expose, plainToClass } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { USER_ROLES } from '@app/constants';
import { ApiProperty } from '@nestjs/swagger';

export class MasterDTO extends UserEntity {
  @ApiProperty({ type: String, example: USER_ROLES.MASTER })
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
  @ApiProperty({ type: USER_ROLES.ACCOUNTANT })
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
