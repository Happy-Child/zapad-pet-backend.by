import { ApiProperty } from '@nestjs/swagger';
import { NonEmptyArray } from '@app/types';
import { ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { Transform, Type } from 'class-transformer';

export class UsersDeleteRequestQueryDTO {
  @ApiProperty({ type: Number, isArray: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  ids!: NonEmptyArray<number>;
}
