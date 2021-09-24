import {
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsString,
  Length,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  CLIENT_MEMBERS_ROLES,
  USER_ROLES,
  USERS_CREATE_ALLOWED_ROLES,
} from '../constants';
import { AUTH_ERRORS } from '../../auth/constants';
import { UniqueArrayOfDistrictLeaders } from '../decorators';
import { Match, UniqueArrayByFields } from '@app/decorators';
import { ClientMembersOrStationWorkerRolesType } from '../types';
import {
  PASSWORD_LENGTH,
  PASSWORD_REGEX,
  USER_NAME_LENGTH,
} from '../../auth/constants';
import { ENTITIES_FIELDS } from '@app/entities';

export class UsersCreateItemDTO {
  @IsString()
  @Length(USER_NAME_LENGTH.MIN, USER_NAME_LENGTH.MAX)
  name!: string;

  @IsEmail()
  email!: string;

  @IsIn(USERS_CREATE_ALLOWED_ROLES, { message: AUTH_ERRORS.INVALID_ROLE })
  role!: ClientMembersOrStationWorkerRolesType;

  @ValidateIf((data) => data.role === USER_ROLES.STATION_WORKER, {
    message: AUTH_ERRORS.CLIENT_ID_IS_REQUIRED,
  })
  @IsInt()
  clientId?: number;

  @ValidateIf((data) => CLIENT_MEMBERS_ROLES.includes(data.role), {
    message: AUTH_ERRORS.DISTRICT_ID_IS_REQUIRED,
  })
  @IsInt()
  districtId?: number;

  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Matches(PASSWORD_REGEX)
  password!: string;

  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Match(ENTITIES_FIELDS.PASSWORD, {
    message: AUTH_ERRORS.CONFIRMATION_PASSWORD_NOT_MATCH,
  })
  passwordConfirmation!: string;
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
