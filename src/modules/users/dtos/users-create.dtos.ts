import {
  ArrayNotEmpty,
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
  ALLOWED_ROLES,
  CLIENT_MEMBERS_ROLES,
  USER_ROLES,
  USERS_CREATE_ALLOWED_ROLES,
} from '../constants';
import { AUTH_ERRORS } from '../../auth/constants';
import { UniqueDistrictLeadersInArray } from '../decorators';
import {
  AllowedRolesType,
  ClientMembersOrStationWorkerRolesType,
} from '../types';
import {
  PASSWORD_LENGTH,
  PASSWORD_REGEX,
  USER_NAME_LENGTH,
} from '../../auth/constants';
import { ENTITIES_FIELDS } from '@app/entities';
import { ArrayWithObjects, UniqueArrayByExistField } from '@app/decorators';

export class UsersCreateGeneralUserDTO {
  @IsString()
  @Length(USER_NAME_LENGTH.MIN, USER_NAME_LENGTH.MAX)
  name!: string;

  @IsEmail()
  email!: string;

  @IsIn(ALLOWED_ROLES, { message: AUTH_ERRORS.INVALID_ROLE })
  role!: AllowedRolesType;

  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Matches(PASSWORD_REGEX)
  password!: string;
}

export class UsersCreateStationWorkerDTO extends UsersCreateGeneralUserDTO {
  @IsIn([USER_ROLES.STATION_WORKER], { message: AUTH_ERRORS.INVALID_ROLE })
  role!: USER_ROLES.STATION_WORKER;

  @IsInt()
  clientId!: number;
}

export class UsersCreateDistrictLeaderDTO extends UsersCreateGeneralUserDTO {
  @IsIn([USER_ROLES.DISTRICT_LEADER], { message: AUTH_ERRORS.INVALID_ROLE })
  role!: USER_ROLES.DISTRICT_LEADER;

  @IsInt()
  districtId!: number;
}

export class UsersCreateEngineerDTO extends UsersCreateGeneralUserDTO {
  @IsIn([USER_ROLES.ENGINEER], { message: AUTH_ERRORS.INVALID_ROLE })
  role!: USER_ROLES.ENGINEER;

  @IsInt()
  districtId!: number;
}

export class UsersCreateAccountantDTO extends UsersCreateGeneralUserDTO {
  @IsIn([USER_ROLES.ACCOUNTANT], { message: AUTH_ERRORS.INVALID_ROLE })
  role!: USER_ROLES.ACCOUNTANT;
}

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
  users!: UsersCreateItemDTO[];
}
