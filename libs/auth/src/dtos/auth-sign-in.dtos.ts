import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { Expose, plainToClass } from 'class-transformer';
import { PASSWORD_LENGTH, PASSWORD_REGEX } from '../constants';
import { UserEntity } from '@app/entities';

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
  user!: UserEntity;

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
