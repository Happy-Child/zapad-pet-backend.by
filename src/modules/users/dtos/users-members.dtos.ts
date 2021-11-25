import { UserEntity } from '@app/entities';
import { Expose, plainToClass } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { USER_ROLES } from '@app/constants';

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
