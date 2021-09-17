import { IsEmail, IsString, Length, Matches } from 'class-validator';
import {} from '@app/auth/constants/common.constants';
import { User } from '@app/entities';
import { Expose, plainToClass } from 'class-transformer';
import {
  PASSWORD_LENGTH,
  PASSWORD_REGEX,
} from '@app/auth/constants/password.constants';

export class SignInRequestBodyDTO {
  @IsEmail()
  email!: string;

  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Matches(PASSWORD_REGEX)
  password!: string;
}

export class SignInResponseBodyDTO {
  @Expose()
  user!: User;

  @Expose()
  accessToken!: string;

  constructor(data: SignInResponseBodyDTO) {
    Object.assign(
      this,
      plainToClass(SignInResponseBodyDTO, data, {
        excludeExtraneousValues: true,
      }),
    );
  }
}
