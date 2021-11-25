import { Expose, plainToClass } from 'class-transformer';
import { Type } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { BidsCountByStatusesDTO } from '../../bids/dtos/bids-general.dtos';
import { RegionEntity } from '@app/entities';

export class RegionDTO extends RegionEntity {
  @Expose()
  countOfEngineers!: number;

  @Expose()
  countOfStations!: number;
}

export class RegionsGetAllResponseBodyDTO {
  @Expose()
  @Type(() => RegionDTO)
  items!: RegionDTO[];

  @Expose()
  totalItemsCount!: number;

  constructor(
    data: RegionsGetAllResponseBodyDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    Object.assign(
      this,
      plainToClass(RegionsGetAllResponseBodyDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

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
