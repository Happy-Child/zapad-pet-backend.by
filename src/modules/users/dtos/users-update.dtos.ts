import {
  ArrayNotEmpty,
  IsArray,
  IsEmail,
  IsIn,
  IsInt,
  IsString,
  Length,
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
import { USER_NAME_LENGTH } from '../../auth/constants';
import {
  ArrayWithObjects,
  NullOrNumber,
  UniqueArrayByExistField,
} from '@app/decorators';
import { GENERAL_ERRORS } from '@app/constants';
import { NonEmptyArray } from '@app/types';

export class UsersUpdateGeneralUserDTO {
  id!: number;

  name!: string;

  email!: string;

  role!: AllowedRoles;
}

export class UsersUpdateStationWorkerDTO extends UsersUpdateGeneralUserDTO {
  role!: USER_ROLES.STATION_WORKER;

  clientId!: number | null;

  stationId!: number | null;
}

export class UsersUpdateDistrictLeaderDTO extends UsersUpdateGeneralUserDTO {
  role!: USER_ROLES.DISTRICT_LEADER;

  districtId!: number | null;
}

export class UsersUpdateEngineerDTO extends UsersUpdateGeneralUserDTO {
  role!: USER_ROLES.ENGINEER;

  districtId!: number | null;
}

export class UsersUpdateItemDTO {
  @IsInt()
  id!: number;

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
}

export class UsersUpdateRequestBodyDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayWithObjects()
  @UniqueArrayByExistField<UsersUpdateItemDTO>(
    'id',
    GENERAL_ERRORS.ID_SHOULD_BE_UNIQUES,
  )
  @UniqueArrayByExistField<UsersUpdateItemDTO>(
    'email',
    AUTH_ERRORS.EMAILS_SHOULD_BE_UNIQUES,
  )
  @UniqueArrayByExistField<UsersUpdateItemDTO>(
    'leaderDistrictId',
    USERS_ERRORS.DISTRICT_LEADERS_SHOULD_HAVE_UNIQUE_DISTRICT_ID,
  )
  @UniqueArrayByExistField<UsersUpdateItemDTO>(
    'stationId',
    USERS_ERRORS.STATIONS_WORKERS_SHOULD_HAVE_UNIQUE_STATION_ID,
  )
  @ValidateNested({ each: true })
  @Type(() => UsersUpdateItemDTO)
  users!: NonEmptyArray<UsersUpdateItemDTO>;
}
