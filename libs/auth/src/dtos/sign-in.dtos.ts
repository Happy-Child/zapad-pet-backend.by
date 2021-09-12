import { IsEmail, IsString, Length, Matches } from 'class-validator';
import {
  PASSWORD_LENGTH,
  PASSWORD_REGEX,
} from '@app/auth/constants/auth.constants';
import { User } from '@app/entities';
import { Expose, plainToClass } from 'class-transformer';

export class SignInRequestBodyDTO {
  @IsEmail()
  email: string;

  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Matches(PASSWORD_REGEX)
  password: string;
}

export class SignInResponseBodyDTO {
  @Expose()
  user: User;

  @Expose()
  accessToken: string;

  constructor(data: Partial<SignInResponseBodyDTO>) {
    Object.assign(
      this,
      plainToClass(SignInResponseBodyDTO, data, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
