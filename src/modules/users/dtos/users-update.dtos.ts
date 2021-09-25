import {
  IsArray,
  ValidateNested,
  IsString,
  Length,
  IsEmail,
  ValidateIf,
  IsInt,
  IsOptional,
  IsIn,
  ArrayNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ClientMembersRolesType } from '../types';
import { AUTH_ERRORS, USER_NAME_LENGTH } from '../../auth/constants';
import { CLIENT_MEMBERS_ROLES } from '../constants';
import { UniqueArrayByFields } from '../../../../libs/decorators/src';
import { ENTITIES_FIELDS } from '../../../../libs/entities/src';
import { UniqueArrayOfDistrictLeaders } from '../decorators';

export class UsersUpdateItemDTO {
  @IsInt()
  id!: string;

  @IsOptional()
  @IsString()
  @Length(USER_NAME_LENGTH.MIN, USER_NAME_LENGTH.MAX)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @ValidateIf((data) => data.districtId)
  @IsIn(CLIENT_MEMBERS_ROLES, { message: AUTH_ERRORS.INVALID_ROLE })
  role?: ClientMembersRolesType;

  @IsOptional()
  @ValidateIf((data) => CLIENT_MEMBERS_ROLES.includes(data.role), {
    message: AUTH_ERRORS.DISTRICT_ID_IS_REQUIRED,
  })
  @IsInt()
  districtId?: number;
}

export class UsersUpdateRequestBodyDTO {
  @IsArray()
  @ArrayNotEmpty()
  @UniqueArrayByFields<UsersUpdateItemDTO>([ENTITIES_FIELDS.EMAIL], {
    message: AUTH_ERRORS.EMAILS_SHOULD_BE_UNIQUES,
  })
  @UniqueArrayByFields<UsersUpdateItemDTO>([ENTITIES_FIELDS.ID], {
    message: AUTH_ERRORS.ID_SHOULD_BE_UNIQUES,
  })
  @UniqueArrayOfDistrictLeaders()
  @ValidateNested({ each: true })
  @Type(() => UsersUpdateItemDTO)
  users!: UsersUpdateItemDTO[];
}
