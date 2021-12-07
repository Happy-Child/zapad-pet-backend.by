import { Expose, plainToClass, Type } from 'class-transformer';
import { DistrictEntity } from '@app/entities';
import { ShortDistrictLeaderMemberDTO } from '../../districts-leaders/dtos';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { BidsCountByStatusesDTO } from '../../bids/dtos';

export class DistrictDTO extends DistrictEntity {
  @Expose()
  @Type(() => ShortDistrictLeaderMemberDTO)
  districtLeader!: ShortDistrictLeaderMemberDTO | null;

  @Expose()
  countOfEngineers!: number;

  @Expose()
  countOfStations!: number;
}

export class DistrictsGetAllResponseBodyDTO {
  @Expose()
  @Type(() => DistrictDTO)
  items!: DistrictDTO[];

  @Expose()
  totalItemsCount!: number;

  constructor(
    data: DistrictsGetAllResponseBodyDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    Object.assign(
      this,
      plainToClass(DistrictsGetAllResponseBodyDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

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

export class DistrictWithStatisticsDTO extends DistrictDTO {
  @Expose()
  @Type(() => DistrictStatisticDTO)
  statistics!: DistrictStatisticDTO;

  constructor(
    data: Partial<DistrictWithStatisticsDTO>,
    serializeOptions?: ClassTransformOptions,
  ) {
    super();
    Object.assign(
      this,
      plainToClass(DistrictWithStatisticsDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}
