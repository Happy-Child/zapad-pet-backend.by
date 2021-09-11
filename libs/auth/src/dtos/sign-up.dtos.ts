import {
  AUTH_ERRORS,
  CLIENT_MEMBERS_ROLES,
  USER_NAME_LENGTH,
  USER_ROLES,
} from '@app/constants';
import {
  IsEmail,
  IsEnum,
  IsInt,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Match } from '@app/auth/decorators/match.decorator';
import { PASSWORD_LENGTH, PASSWORD_REGEX } from '@app/auth/auth.constants';

export class SignUpRequestBodyDTO {
  @IsString()
  @Length(USER_NAME_LENGTH.MIN, USER_NAME_LENGTH.MAX)
  name: string;

  @IsEmail()
  email: string;

  @IsEnum(USER_ROLES)
  role: USER_ROLES;

  @ValidateIf((data) => data.role === USER_ROLES.STATION_WORKER)
  @IsInt()
  clientId?: number;

  @ValidateIf((data) => CLIENT_MEMBERS_ROLES.includes(data.role))
  @IsInt()
  districtId?: number;

  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Matches(PASSWORD_REGEX)
  password: string;

  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Match('password', { message: AUTH_ERRORS.CONFIRMATION_PASSWORD_NOT_MATCH })
  passwordConfirmation: string;
}
