import { Expose, Type } from 'class-transformer';
import { ArrayNotEmpty, ArrayUnique } from 'class-validator';

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
  ids!: number[];
}

export class DistrictAddEngineersRequestBodyDTO extends DistrictEngineersRequestDTO {}

export class DistrictRemoveEngineersRequestQueryDTO extends DistrictEngineersRequestDTO {}
