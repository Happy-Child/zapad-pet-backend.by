import {
  IsArray,
  ValidateNested,
  ArrayUnique,
  IsString,
  Length,
  IsEmail,
  ValidateIf,
  IsInt,
  IsOptional,
  IsIn,
} from 'class-validator';
import { Type } from 'class-transformer';
import { USER_NAME_LENGTH } from '@app/auth/constants/common.constants';
import { AUTH_ERRORS } from '@app/auth/constants/errors.constants';
import { UsersUpdateRolesType } from '../types/update.types';
import { CLIENT_MEMBERS_ROLES } from '@app/constants';

export class UsersUpdateItemDTO {
  @IsInt()
  id: string;

  @IsOptional()
  @IsString()
  @Length(USER_NAME_LENGTH.MIN, USER_NAME_LENGTH.MAX)
  name?: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @ValidateIf((data) => data.districtId)
  @IsIn(CLIENT_MEMBERS_ROLES, { message: AUTH_ERRORS.INVALID_ROLE })
  role?: UsersUpdateRolesType;

  @IsOptional()
  @ValidateIf((data) => CLIENT_MEMBERS_ROLES.includes(data.role), {
    message: AUTH_ERRORS.DISTRICT_ID_IS_REQUIRED,
  })
  @IsInt()
  districtId?: number;
}

export class UsersUpdateRequestBodyDTO {
  @IsArray()
  @ArrayUnique<UsersUpdateItemDTO>((item) => item.email, {
    message: AUTH_ERRORS.EMAILS_SHOULD_BE_UNIQUES,
  })
  @ArrayUnique<UsersUpdateItemDTO>((item) => item.id, {
    message: AUTH_ERRORS.ID_SHOULD_BE_UNIQUES,
  })
  @ValidateNested({ each: true })
  @Type(() => UsersUpdateItemDTO)
  users: UsersUpdateItemDTO[];
}
