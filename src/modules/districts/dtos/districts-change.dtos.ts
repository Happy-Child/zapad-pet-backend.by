import { Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { NonEmptyArray } from '@app/types';
import { ApiProperty } from '@nestjs/swagger';

export class DistrictChangeLeaderRequestBodyDTO {
  @Type(() => Number)
  @Expose()
  id!: number;
}

class DistrictEngineersRequestDTO {
  @ApiProperty({ type: Number, isArray: true })
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => Number)
  @Expose()
  ids!: NonEmptyArray<number>;
}

export class DistrictAddEngineersRequestBodyDTO extends DistrictEngineersRequestDTO {}

export class DistrictRemoveEngineersRequestQueryDTO extends DistrictEngineersRequestDTO {}
