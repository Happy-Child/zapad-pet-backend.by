import { IsString, Length } from 'class-validator';
import { CLIENT_NAME_LENGTH } from '../constants';
import { ApiProperty } from '@nestjs/swagger';

export class ClientsUpdateBodyDTO {
  @ApiProperty()
  @IsString()
  @Length(CLIENT_NAME_LENGTH.MIN, CLIENT_NAME_LENGTH.MAX)
  name!: string;
}
