import { Expose, plainToClass } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class ShortUserDTO {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  name!: string;

  @ApiProperty()
  @Expose()
  email!: string;

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

export class StorageFileDTO {
  @ApiProperty({ type: Number })
  @Expose()
  id!: number;

  @ApiProperty({ type: String })
  @Expose()
  url!: string;
}
