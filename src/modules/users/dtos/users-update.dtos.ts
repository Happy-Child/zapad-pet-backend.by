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
import { USERS_CREATE_ALLOWED_ROLES } from '../constants';
import { AUTH_ERRORS, USERS_ERRORS } from '@app/constants';
import { USER_NAME_LENGTH } from '../../auth/constants';
import {
  ArrayWithObjects,
  NullOrNumber,
  UniqueArrayByExistField,
} from '@app/decorators';
import { GENERAL_ERRORS, USER_ROLES } from '@app/constants';
import { NonEmptyArray } from '@app/types';
import { AddValidateIf } from '@app/decorators/add-validate-if.decorators';
import { isNull } from '@app/helpers';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class UsersUpdateGeneralUserDTO {
  id!: number;

  name!: string;

  email!: string;

  role!: USER_ROLES;
}

export class UsersUpdateStationWorkerDTO extends UsersUpdateGeneralUserDTO {
  role!: USER_ROLES.STATION_WORKER;

  clientId!: number | null;

  stationId!: number | null;
}

export class UsersUpdateDistrictLeaderDTO extends UsersUpdateGeneralUserDTO {
  role!: USER_ROLES.DISTRICT_LEADER;

  leaderDistrictId!: number | null;
}

export class UsersUpdateEngineerDTO extends UsersUpdateGeneralUserDTO {
  role!: USER_ROLES.ENGINEER;

  engineerDistrictId!: number | null;
}

export class UsersUpdateItemDTO {
  @ApiProperty()
  @IsInt()
  id!: number;

  @ApiProperty()
  @IsString()
  @Length(USER_NAME_LENGTH.MIN, USER_NAME_LENGTH.MAX)
  name!: string;

  @ApiProperty()
  @IsEmail()
  email!: string;

  @ApiProperty({ enum: USERS_CREATE_ALLOWED_ROLES })
  @IsString()
  @IsIn(USERS_CREATE_ALLOWED_ROLES, { message: AUTH_ERRORS.INVALID_ROLE })
  role!: USER_ROLES;

  @ApiPropertyOptional({ type: Number, nullable: true })
  @ValidateIf((data) => data.role === USER_ROLES.STATION_WORKER, {
    message: AUTH_ERRORS.CLIENT_ID_IS_REQUIRED,
  })
  @NullOrNumber()
  clientId?: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  @ValidateIf((data) => data.role === USER_ROLES.STATION_WORKER, {
    message: AUTH_ERRORS.STATION_ID_IS_REQUIRED,
  })
  @AddValidateIf(
    (data) => isNull(data.clientId),
    (val) => val === null,
    USERS_ERRORS.CANNOT_EXIST_WITHOUT_CLIENT,
  )
  @NullOrNumber()
  stationId?: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  @ValidateIf((data) => data.role === USER_ROLES.DISTRICT_LEADER, {
    message: AUTH_ERRORS.DISTRICT_ID_IS_REQUIRED,
  })
  @NullOrNumber()
  leaderDistrictId?: number | null;

  @ApiPropertyOptional({ type: Number, nullable: true })
  @ValidateIf((data) => data.role === USER_ROLES.ENGINEER, {
    message: AUTH_ERRORS.DISTRICT_ID_IS_REQUIRED,
  })
  @NullOrNumber()
  engineerDistrictId?: number | null;
}

export class UsersUpdateRequestBodyDTO {
  @ApiProperty({ type: UsersUpdateItemDTO, isArray: true })
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
