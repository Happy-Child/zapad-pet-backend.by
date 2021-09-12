import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { TokenRequestDTO } from '@app/dtos';
import {
  PASSWORD_LENGTH,
  PASSWORD_REGEX,
} from '@app/auth/constants/auth.constants';
import { Match } from '@app/auth/decorators/match.decorator';
import { AUTH_ERRORS } from '@app/constants';
import { Expose, plainToClass } from 'class-transformer';

export class PasswordRecoveryRequestBodyDTO {
  @IsEmail()
  email: string;
}

export class PasswordRecoveryResponseBodyDTO {
  @Expose()
  wasSent: boolean;

  @Expose()
  attemptCount: number;

  @Expose()
  updatedAt: Date;

  constructor(data: Partial<PasswordRecoveryResponseBodyDTO>) {
    Object.assign(
      this,
      plainToClass(PasswordRecoveryResponseBodyDTO, data, {
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class CreateNewPasswordRequestBodyDTO extends TokenRequestDTO {
  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Matches(PASSWORD_REGEX)
  password: string;

  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Match('password', { message: AUTH_ERRORS.CONFIRMATION_PASSWORD_NOT_MATCH })
  passwordConfirmation: string;
}
