import { Expose, plainToClass } from 'class-transformer';
import { Type } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { BidsCountByStatusesDTO } from '../../bids/dtos/bids-general.dtos';

export class RegionStatisticDTO {
  @Expose()
  @Type(() => BidsCountByStatusesDTO)
  bidsCountByStatuses!: BidsCountByStatusesDTO;

  constructor(
    data: RegionStatisticDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    Object.assign(
      this,
      plainToClass(RegionStatisticDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}
