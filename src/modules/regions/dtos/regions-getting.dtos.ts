import { Expose, plainToClass } from 'class-transformer';
import { Type } from 'class-transformer';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { BidsCountByStatusesDTO } from '../../bids/dtos';
import { RegionEntity } from '@app/entities';
import { ApiProperty } from '@nestjs/swagger';

export class RegionDTO extends RegionEntity {
  @ApiProperty()
  @Expose()
  countOfEngineers!: number;

  @ApiProperty()
  @Expose()
  countOfStations!: number;
}

export class RegionsGetAllResponseBodyDTO {
  @ApiProperty({ type: RegionDTO, isArray: true })
  @Expose()
  @Type(() => RegionDTO)
  items!: RegionDTO[];

  @ApiProperty()
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
  @ApiProperty({ type: BidsCountByStatusesDTO })
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
