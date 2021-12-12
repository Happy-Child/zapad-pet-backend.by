import { IsEmail, IsString, Length, Matches } from 'class-validator';
import { Expose } from 'class-transformer';
import { PASSWORD_LENGTH, PASSWORD_REGEX } from '../constants';
import { TUserDTO } from '../../users/types';
import { ApiProperty, getSchemaPath } from '@nestjs/swagger';
import { StationWorkerMemberDTO } from '../../stations-workers/dtos';
import { AccountantDTO, MasterDTO } from '../../users/dtos';
import { DistrictLeaderMemberDTO } from '../../districts-leaders/dtos';
import { EngineerMemberDTO } from '../../engineers/dtos';

export class SignInRequestBodyDTO {
  @ApiProperty({ required: true })
  @IsEmail()
  email!: string;

  @ApiProperty({ required: true })
  @IsString()
  @Length(PASSWORD_LENGTH.MIN, PASSWORD_LENGTH.MAX)
  @Matches(PASSWORD_REGEX)
  password!: string;
}

export class SignInResponseBodyDTO {
  @ApiProperty({
    oneOf: [
      { $ref: getSchemaPath(MasterDTO) },
      { $ref: getSchemaPath(StationWorkerMemberDTO) },
      { $ref: getSchemaPath(DistrictLeaderMemberDTO) },
      { $ref: getSchemaPath(EngineerMemberDTO) },
      { $ref: getSchemaPath(AccountantDTO) },
    ],
  })
  @Expose()
  user!: TUserDTO;

  @ApiProperty()
  @Expose()
  accessToken!: string;

  constructor(data: SignInResponseBodyDTO) {
    Object.assign(this, data);
  }
}
