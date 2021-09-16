import {
  IsArray,
  ValidateNested,
  ArrayUnique,
  IsString,
  Length,
  IsEmail,
  IsEnum,
  ValidateIf,
  IsInt,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { USERS_ERRORS } from '../constants/errors.constants';
import { USER_NAME_LENGTH } from '@app/auth/constants/common.constants';
import { CLIENT_MEMBERS_ROLES, USER_ROLES } from '@app/constants';

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
  @IsEnum(USER_ROLES)
  role: USER_ROLES;

  @IsOptional()
  @ValidateIf((data) => CLIENT_MEMBERS_ROLES.includes(data.role))
  @IsInt()
  districtId?: number;
}

export class UsersUpdateRequestBodyDTO {
  @IsArray()
  @ArrayUnique<UsersUpdateItemDTO>((item) => item.email, {
    message: USERS_ERRORS.EMAILS_SHOULD_BE_UNIQUES,
  })
  @ValidateNested({ each: true })
  @Type(() => UsersUpdateItemDTO)
  users: UsersUpdateItemDTO[];
}
