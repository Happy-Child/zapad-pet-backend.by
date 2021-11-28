import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { TokenRequestDTO } from '@app/dtos';
import { Expose } from 'class-transformer';
import { PASSWORD_LENGTH, PASSWORD_REGEX } from '../constants';
import { Match } from '@app/decorators';
import { AUTH_ERRORS } from '@app/constants';
import { ENTITIES_FIELDS } from '@app/constants';

export class PasswordRecoveryRequestBodyDTO {
  @IsEmail()
  email!: string;
}

export class PasswordRecoveryResponseBodyDTO {
  @Expose()
  wasSent!: boolean;

  @Expose()
  attemptCount!: number;

  @Expose()
  updatedAt!: Date;

  constructor(data: PasswordRecoveryResponseBodyDTO) {
    Object.assign(this, data);
  }
}

export class CreateNewPasswordRequestBodyDTO extends TokenRequestDTO {
  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Matches(PASSWORD_REGEX)
  password!: string;

  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Match(ENTITIES_FIELDS.PASSWORD, {
    message: AUTH_ERRORS.CONFIRMATION_PASSWORD_NOT_MATCH,
  })
  passwordConfirmation!: string;
}
