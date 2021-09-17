import { IsString } from 'class-validator';

export class TokenRequestDTO {
  @IsString()
  token!: string;
}
