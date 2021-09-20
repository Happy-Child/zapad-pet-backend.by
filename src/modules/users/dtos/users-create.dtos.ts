import { IsArray, IsIn, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { SignUpRequestBodyDTO } from '@app/auth/dtos';
import { USERS_CREATE_ALLOWED_ROLES } from '../constants';
import { AUTH_ERRORS } from '@app/auth/constants';
import { UniqueArrayOfDistrictLeaders } from '../decorators';
import { UniqueArrayByFields } from '@app/decorators';
import { ClientMembersOrStationWorkerRolesType } from '@app/user';

export class UsersCreateItemDTO extends SignUpRequestBodyDTO {
  @IsIn(USERS_CREATE_ALLOWED_ROLES, { message: AUTH_ERRORS.INVALID_ROLE })
  role!: ClientMembersOrStationWorkerRolesType;
}

export class UsersCreateRequestBodyDTO {
  @IsArray()
  @UniqueArrayByFields<UsersCreateItemDTO>(['email'], {
    message: AUTH_ERRORS.EMAILS_SHOULD_BE_UNIQUES,
  })
  @UniqueArrayOfDistrictLeaders()
  @ValidateNested({ each: true })
  @Type(() => UsersCreateItemDTO)
  users!: UsersCreateItemDTO[];
}
