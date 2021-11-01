import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsIn,
  IsString,
  Length,
  Matches,
  ValidateIf,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  USER_ROLES,
  USERS_CREATE_ALLOWED_ROLES,
  USERS_ERRORS,
} from '../constants';
import { AUTH_ERRORS } from '../../auth/constants';
import { AllowedRoles } from '../types';
import {
  PASSWORD_LENGTH,
  PASSWORD_REGEX,
  USER_NAME_LENGTH,
} from '../../auth/constants';
import {
  ArrayWithObjects,
  NullOrNumber,
  UniqueArrayByExistField,
} from '@app/decorators';
import { NonEmptyArray } from '@app/types';

export class UsersCreateGeneralUserDTO {
  name!: string;

  email!: string;

  role!: AllowedRoles;

  password!: string;

  index!: number;
}

export class UsersCreateFullStationWorkerDTO extends UsersCreateGeneralUserDTO {
  role!: USER_ROLES.STATION_WORKER;

  clientId!: number;

  stationId!: number | null;
}

export class UsersCreateFullDistrictLeaderDTO extends UsersCreateGeneralUserDTO {
  role!: USER_ROLES.DISTRICT_LEADER;

  leaderDistrictId!: number;
}

export class UsersCreateFullEngineerDTO extends UsersCreateGeneralUserDTO {
  role!: USER_ROLES.ENGINEER;

  engineerDistrictId!: number;
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

  @ValidateIf((data) => data.role === USER_ROLES.STATION_WORKER, {
    message: AUTH_ERRORS.CLIENT_ID_IS_REQUIRED,
  })
  @NullOrNumber()
  clientId?: number | null;

  @ValidateIf((data) => data.role === USER_ROLES.STATION_WORKER, {
    message: AUTH_ERRORS.STATION_ID_IS_REQUIRED,
  })
  @NullOrNumber()
  stationId?: number | null;

  @ValidateIf((data) => data.role === USER_ROLES.DISTRICT_LEADER, {
    message: AUTH_ERRORS.DISTRICT_ID_IS_REQUIRED,
  })
  @NullOrNumber()
  leaderDistrictId?: number | null;

  @ValidateIf((data) => data.role === USER_ROLES.ENGINEER, {
    message: AUTH_ERRORS.DISTRICT_ID_IS_REQUIRED,
  })
  @NullOrNumber()
  engineerDistrictId?: number | null;

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
    'email',
    AUTH_ERRORS.EMAILS_SHOULD_BE_UNIQUES,
  )
  @UniqueArrayByExistField<UsersCreateItemDTO>(
    'leaderDistrictId',
    USERS_ERRORS.DISTRICT_LEADERS_SHOULD_HAVE_UNIQUE_DISTRICT_ID,
  )
  @UniqueArrayByExistField<UsersCreateItemDTO>(
    'stationId',
    USERS_ERRORS.STATIONS_WORKERS_SHOULD_HAVE_UNIQUE_STATION_ID,
  )
  @ValidateNested({ each: true })
  @Type(() => UsersCreateItemDTO)
  users!: NonEmptyArray<UsersCreateItemDTO>;
}
