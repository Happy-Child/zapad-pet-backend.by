import { SignUpRequestBodyDTO } from '@app/auth/dtos/sign-up.dtos';
import { IsArray, ValidateNested, ArrayUnique } from 'class-validator';
import { Type } from 'class-transformer';
import { USERS_ERRORS } from '../constants/errors.constants';

export class UsersCreateItemDTO extends SignUpRequestBodyDTO {}

export class UsersCreateRequestBodyDTO {
  @IsArray()
  @ArrayUnique<UsersCreateItemDTO>((item) => item.email, {
    message: USERS_ERRORS.EMAILS_SHOULD_BE_UNIQUES,
  })
  @ValidateNested({ each: true })
  @Type(() => UsersCreateItemDTO)
  users: UsersCreateItemDTO[];
}
