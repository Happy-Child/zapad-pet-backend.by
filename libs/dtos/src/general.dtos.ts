import { IsInt, Max, Min } from 'class-validator';
import { Expose, plainToClass, Type } from 'class-transformer';
import { MAX_INTEGER } from '@app/constants';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';

export class IdParamDTO {
  @IsInt()
  @Min(1)
  @Max(MAX_INTEGER)
  @Type(() => Number)
  id!: number;
}

export class ShortUserDTO {
  @Expose()
  id!: number;

  @Expose()
  name!: string;

  constructor(
    data: Partial<ShortUserDTO>,
    serializeOptions?: ClassTransformOptions,
  ) {
    Object.assign(
      this,
      plainToClass(ShortUserDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}
