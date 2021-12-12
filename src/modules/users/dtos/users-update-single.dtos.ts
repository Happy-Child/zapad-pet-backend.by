import {
  IsEmail,
  IsString,
  Length,
  Matches,
  ValidateIf,
} from 'class-validator';
import {
  PASSWORD_LENGTH,
  PASSWORD_REGEX,
  USER_NAME_LENGTH,
} from '../../auth/constants';
import { GENERAL_ERRORS } from '@app/constants';
import { isUndefined } from '@app/helpers';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UsersUpdateSingleRequestBodyDTO {
  @ApiPropertyOptional()
  @IsString()
  @Length(USER_NAME_LENGTH.MIN, USER_NAME_LENGTH.MAX)
  name?: string;

  @ApiPropertyOptional()
  @IsEmail()
  email?: string;

  @ApiPropertyOptional()
  @ValidateIf((data) => !isUndefined(data.curPassword), {
    message: GENERAL_ERRORS.REQUIRED_FIELD,
  })
  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Matches(PASSWORD_REGEX)
  newPassword?: string;

  @ApiPropertyOptional()
  @ValidateIf((data) => !isUndefined(data.newPassword), {
    message: GENERAL_ERRORS.REQUIRED_FIELD,
  })
  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Matches(PASSWORD_REGEX)
  curPassword?: string;
}
