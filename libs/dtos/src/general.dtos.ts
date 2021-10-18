import { IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { MAX_INTEGER } from '@app/constants';

export class IdParamDTO {
  @IsInt()
  @Min(1)
  @Max(MAX_INTEGER)
  @Type(() => Number)
  id!: number;
}
