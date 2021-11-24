import { Expose, plainToClass } from 'class-transformer';
import { Type } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { BidsCountByStatusesDTO } from '../../bids/dtos/bids-general.dtos';

export class DistrictStatisticDTO {
  @Expose()
  @Type(() => BidsCountByStatusesDTO)
  bidsCountByStatuses!: BidsCountByStatusesDTO;

  constructor(
    data: DistrictStatisticDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    Object.assign(
      this,
      plainToClass(DistrictStatisticDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}
