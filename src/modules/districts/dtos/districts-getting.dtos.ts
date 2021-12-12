import { Expose, plainToClass, Type } from 'class-transformer';
import { DistrictEntity } from '@app/entities';
import { ShortDistrictLeaderMemberDTO } from '../../districts-leaders/dtos';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { BidsCountByStatusesDTO } from '../../bids/dtos';
import { ApiProperty } from '@nestjs/swagger';

export class DistrictDTO extends DistrictEntity {
  @ApiProperty({ type: ShortDistrictLeaderMemberDTO, nullable: true })
  @Expose()
  @Type(() => ShortDistrictLeaderMemberDTO)
  districtLeader!: ShortDistrictLeaderMemberDTO | null;

  @ApiProperty()
  @Expose()
  countOfEngineers!: number;

  @ApiProperty()
  @Expose()
  countOfStations!: number;
}

export class DistrictsGetAllResponseBodyDTO {
  @ApiProperty({ type: DistrictDTO, isArray: true })
  @Expose()
  @Type(() => DistrictDTO)
  items!: DistrictDTO[];

  @ApiProperty()
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
  @ApiProperty({ type: BidsCountByStatusesDTO })
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
  @ApiProperty({ type: DistrictStatisticDTO })
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
