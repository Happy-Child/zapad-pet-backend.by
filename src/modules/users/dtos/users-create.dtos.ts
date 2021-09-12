import { SignUpRequestBodyDTO } from '@app/auth/dtos/sign-up.dtos';
import { IsArray, ValidateNested, ArrayUnique } from 'class-validator';
import { Type } from 'class-transformer';
import { USERS_ERRORS } from '../constants/errors.constants';
import { USER_ROLES } from '@app/constants';

export class UsersCreateDataDTO extends SignUpRequestBodyDTO {}

export class UsersCreateStationWorkerDataDTO extends UsersCreateDataDTO {
  role: USER_ROLES.STATION_WORKER;
}

export class UsersCreateRequestBodyDTO {
  @IsArray()
  @ArrayUnique<UsersCreateDataDTO>((item) => item.email, {
    message: USERS_ERRORS.EMAILS_SHOULD_BE_UNIQUES,
  })
  @ValidateNested({ each: true })
  @Type(() => UsersCreateDataDTO)
  users: UsersCreateDataDTO[];
}
