import { IsArray, ValidateNested, ArrayUnique, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { SignUpRequestBodyDTO } from '@app/auth/dtos';
import { USERS_CREATE_ALLOWED_ROLES } from '../constants';
import { ClientMembersOrStationWorkerRolesType } from '@app/types';
import { AUTH_ERRORS } from '@app/auth/constants';

export class UsersCreateItemDTO extends SignUpRequestBodyDTO {
  @IsIn(USERS_CREATE_ALLOWED_ROLES, { message: AUTH_ERRORS.INVALID_ROLE })
  role!: ClientMembersOrStationWorkerRolesType;
}

export class UsersCreateRequestBodyDTO {
  @IsArray()
  @ArrayUnique<UsersCreateItemDTO>((item) => item.email, {
    message: AUTH_ERRORS.EMAILS_SHOULD_BE_UNIQUES,
  })
  @ValidateNested({ each: true })
  @Type(() => UsersCreateItemDTO)
  users!: UsersCreateItemDTO[];
}
