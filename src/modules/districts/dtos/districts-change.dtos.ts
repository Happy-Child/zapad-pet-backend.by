import { Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, ArrayUnique } from 'class-validator';
import { NonEmptyArray } from '@app/types';

export class DistrictChangeLeaderRequestBodyDTO {
  @Type(() => Number)
  @Expose()
  id!: number;
}

class DistrictEngineersRequestDTO {
  @ArrayNotEmpty()
  @ArrayUnique()
  @Type(() => Number)
  @Expose()
  ids!: NonEmptyArray<number>;
}

export class DistrictAddEngineersRequestBodyDTO extends DistrictEngineersRequestDTO {}

export class DistrictRemoveEngineersRequestQueryDTO extends DistrictEngineersRequestDTO {}
