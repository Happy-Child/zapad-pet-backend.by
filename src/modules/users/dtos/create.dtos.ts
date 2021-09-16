import { SignUpRequestBodyDTO } from '@app/auth/dtos/sign-up.dtos';
import { IsArray, ValidateNested, ArrayUnique, IsIn } from 'class-validator';
import { Type } from 'class-transformer';
import { AUTH_ERRORS } from '@app/auth/constants/errors.constants';
import { USERS_CREATE_ALLOWED_ROLES } from '../constants/create.constants';
import { USER_ROLES } from '@app/constants';

export class UsersCreateItemDTO extends SignUpRequestBodyDTO {
  @IsIn(USERS_CREATE_ALLOWED_ROLES, { message: AUTH_ERRORS.INVALID_ROLE })
  role:
    | USER_ROLES.STATION_WORKER
    | USER_ROLES.ENGINEER
    | USER_ROLES.DISTRICT_LEADER; // TODO how get type by USERS_CREATE_ALLOWED_ROLES?
}

export class UsersCreateRequestBodyDTO {
  @IsArray()
  @ArrayUnique<UsersCreateItemDTO>((item) => item.email, {
    message: AUTH_ERRORS.EMAILS_SHOULD_BE_UNIQUES,
  })
  @ValidateNested({ each: true })
  @Type(() => UsersCreateItemDTO)
  users: UsersCreateItemDTO[];
}
