import { IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class TokenRequestDTO {
  @ApiProperty({
    required: true,
  })
  @IsString()
  token!: string;
}
