import { StationEntity } from '@app/entities';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { Expose, plainToClass } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class StationExtendedDTO extends StationEntity {
  @ApiProperty({ type: Number, nullable: true })
  @Expose()
  stationWorkerId!: number | null;

  constructor(
    data: StationExtendedDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    super();
    Object.assign(
      this,
      plainToClass(StationExtendedDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}
