import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  DISTRICT_MEMBERS_ROLES,
  USER_ROLES,
  USERS_CREATE_ALLOWED_ROLES,
} from '../constants';
import { AUTH_ERRORS } from '../../auth/constants';
import { UniqueDistrictLeadersInArray } from '../decorators';
import { AllowedRoles } from '../types';
import {
  PASSWORD_LENGTH,
  PASSWORD_REGEX,
  USER_NAME_LENGTH,
} from '../../auth/constants';
import { ArrayWithObjects, UniqueArrayByExistField } from '@app/decorators';
import { ENTITIES_FIELDS } from '@app/constants';
import { NonEmptyArray } from '@app/types';

export class UsersCreateGeneralUserDTO {
  name!: string;

  email!: string;

  role!: AllowedRoles;

  password!: string;
}

export class UsersCreateStationWorkerDTO extends UsersCreateGeneralUserDTO {
  role!: USER_ROLES.STATION_WORKER;

  clientId!: number;
}

export class UsersCreateDistrictLeaderDTO extends UsersCreateGeneralUserDTO {
  role!: USER_ROLES.DISTRICT_LEADER;

  districtId!: number;
}

export class UsersCreateEngineerDTO extends UsersCreateGeneralUserDTO {
  role!: USER_ROLES.ENGINEER;

  districtId!: number;
}

export class UsersCreateItemDTO {
  @IsString()
  @Length(USER_NAME_LENGTH.MIN, USER_NAME_LENGTH.MAX)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @IsIn(USERS_CREATE_ALLOWED_ROLES, { message: AUTH_ERRORS.INVALID_ROLE })
  role!: AllowedRoles;

  @IsOptional()
  @ValidateIf((data) => data.role === USER_ROLES.STATION_WORKER, {
    message: AUTH_ERRORS.CLIENT_ID_IS_REQUIRED,
  })
  @IsInt()
  clientId?: number;

  @IsOptional()
  @ValidateIf((data) => DISTRICT_MEMBERS_ROLES.includes(data.role), {
    message: AUTH_ERRORS.DISTRICT_ID_IS_REQUIRED,
  })
  @IsInt()
  districtId?: number;

  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Matches(PASSWORD_REGEX)
  password!: string;
}

export class UsersCreateRequestBodyDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayWithObjects()
  @UniqueArrayByExistField<UsersCreateItemDTO>(
    ENTITIES_FIELDS.EMAIL,
    AUTH_ERRORS.EMAILS_SHOULD_BE_UNIQUES,
  )
  @UniqueDistrictLeadersInArray()
  @ValidateNested({ each: true })
  @Type(() => UsersCreateItemDTO)
  users!: NonEmptyArray<UsersCreateItemDTO>;
}
