import { PaginationRequestDTO, PaginationResponseDTO } from '@app/dtos';
import {
  ArrayUnique,
  IsBoolean,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose, plainToClass, Transform, Type } from 'class-transformer';
import { SORT_DURATION } from '@app/constants';
import { STATIONS_LIST_SORT_BY } from '../constants';
import { ClientEntity, DistrictEntity, RegionEntity } from '@app/entities';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { valueToBool } from '@app/helpers';
import { BidsCountByStatusesDTO } from '../../bids/dtos';
import { ShortStationWorkerMemberDTO } from '../../stations-workers/dtos';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class StationDTO {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  number!: string;

  @ApiProperty({ type: RegionEntity })
  @Expose()
  @Type(() => RegionEntity)
  region!: RegionEntity;

  @ApiProperty({ type: DistrictEntity })
  @Expose()
  @Type(() => DistrictEntity)
  district!: DistrictEntity;

  @ApiProperty({ type: ClientEntity })
  @Expose()
  @Type(() => ClientEntity)
  client!: ClientEntity;

  @ApiProperty({ type: ShortStationWorkerMemberDTO, nullable: true })
  @Expose()
  @Type(() => ShortStationWorkerMemberDTO)
  stationWorker!: ShortStationWorkerMemberDTO | null;

  constructor(
    data: Partial<StationDTO>,
    serializeOptions?: ClassTransformOptions,
  ) {
    Object.assign(
      this,
      plainToClass(StationDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class StationsGetListRequestQueryDTO extends PaginationRequestDTO {
  @ApiPropertyOptional({ enum: STATIONS_LIST_SORT_BY })
  @IsOptional()
  @IsIn(STATIONS_LIST_SORT_BY)
  sortBy?: typeof STATIONS_LIST_SORT_BY[number];

  @ApiPropertyOptional({ enum: SORT_DURATION })
  @IsOptional()
  @IsEnum(SORT_DURATION)
  sortDuration?: SORT_DURATION;

  @ApiPropertyOptional({ type: Number, isArray: true })
  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  districtIds?: number[];

  @ApiPropertyOptional({ type: Number, isArray: true })
  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  clientIds?: number[];

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => valueToBool(value))
  @IsBoolean()
  withBids?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @Transform(({ value }) => valueToBool(value))
  @IsBoolean()
  withWorker?: boolean;
}

export class StationsGetListResponseBodyDTO extends PaginationResponseDTO<StationDTO> {
  @ApiProperty({ type: StationDTO, isArray: true })
  @Expose()
  items!: StationDTO[];

  constructor(data: StationsGetListResponseBodyDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map((item) => new StationDTO(item));
  }
}

export class StationStatisticDTO {
  @ApiProperty({ type: BidsCountByStatusesDTO })
  @Expose()
  @Type(() => BidsCountByStatusesDTO)
  bidsCountByStatuses!: BidsCountByStatusesDTO;

  constructor(
    data: StationStatisticDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    Object.assign(
      this,
      plainToClass(StationStatisticDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class StationWithStatisticsDTO extends StationDTO {
  @ApiProperty({ type: StationStatisticDTO })
  @Expose()
  @Type(() => StationStatisticDTO)
  statistics!: StationStatisticDTO;

  constructor(
    data: Partial<StationWithStatisticsDTO>,
    serializeOptions?: ClassTransformOptions,
  ) {
    super(data, serializeOptions);
    Object.assign(
      this,
      plainToClass(StationWithStatisticsDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}
