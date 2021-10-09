import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { Expose } from 'class-transformer';
import { PASSWORD_LENGTH, PASSWORD_REGEX } from '../constants';
import { TMemberDTO } from '../../users/types';
import { SimpleUserDTO } from '../../users/dtos';

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
  user!: TMemberDTO | SimpleUserDTO;

  @Expose()
  accessToken!: string;

  constructor(data: SignInResponseBodyDTO) {
    Object.assign(this, data);
  }
}
