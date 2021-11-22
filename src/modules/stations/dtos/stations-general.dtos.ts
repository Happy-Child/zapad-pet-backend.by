import { StationEntity } from '@app/entities';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { Expose, plainToClass } from 'class-transformer';

export class StationExtendedDTO extends StationEntity {
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
