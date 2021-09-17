import { CLIENT_MEMBERS_ROLES, USER_ROLES } from '@app/constants';
import {
  IsEmail,
  IsIn,
  IsInt,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import { Match } from '@app/auth/decorators/match.decorator';
import { USER_NAME_LENGTH } from '@app/auth/constants/common.constants';
import {
  PASSWORD_LENGTH,
  PASSWORD_REGEX,
} from '@app/auth/constants/password.constants';
import { AUTH_ERRORS } from '@app/auth/constants/errors.constants';
import { SIGN_UP_ALLOWED_ROLES } from '@app/auth/constants/roles.constants';
import { SignUpRolesType } from '@app/auth/types/roles.types';

export class SignUpRequestBodyDTO {
  @IsString()
  @Length(USER_NAME_LENGTH.MIN, USER_NAME_LENGTH.MAX)
  name!: string;

  @IsEmail()
  email!: string;

  @IsIn(SIGN_UP_ALLOWED_ROLES, { message: AUTH_ERRORS.INVALID_ROLE })
  role!: SignUpRolesType;

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
  @Match('password', { message: AUTH_ERRORS.CONFIRMATION_PASSWORD_NOT_MATCH })
  passwordConfirmation!: string;
}
