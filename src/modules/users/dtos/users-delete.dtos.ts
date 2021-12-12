import { ApiProperty } from '@nestjs/swagger';

export class UsersDeleteRequestQueryDTO {
  @ApiProperty({ type: Number, isArray: true })
  ids!: number[];
}
