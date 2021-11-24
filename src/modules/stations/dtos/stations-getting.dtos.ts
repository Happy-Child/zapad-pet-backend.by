import { PaginationRequestDTO, PaginationResponseDTO } from '@app/dtos';
import {
  ArrayUnique,
  IsBoolean,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
} from 'class-validator';
import { Expose, plainToClass, Transform } from 'class-transformer';
import { SORT_DURATION } from '@app/constants';
import { STATIONS_LIST_SORT_BY, STATIONS_SORT_BY } from '../constants';
import { Type } from 'class-transformer';
import {
  ClientEntity,
  DistrictEntity,
  RegionEntity,
  UserEntity,
} from '@app/entities';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { valueToBool } from '@app/helpers';
import { BidsCountByStatusesDTO } from '../../bids/dtos/bids-general.dtos';

export class StationDTO {
  @Expose()
  id!: number;

  @Expose()
  number!: number;

  @Expose()
  @Type(() => RegionEntity)
  region!: RegionEntity;

  @Expose()
  @Type(() => DistrictEntity)
  district!: DistrictEntity;

  @Expose()
  @Type(() => ClientEntity)
  client!: ClientEntity;

  @Expose()
  @Type(() => UserEntity)
  stationWorker!: UserEntity;

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
  @IsOptional()
  @IsIn(STATIONS_LIST_SORT_BY)
  sortBy?: STATIONS_SORT_BY;

  @IsOptional()
  @IsEnum(SORT_DURATION)
  sortDuration?: SORT_DURATION;

  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  districtIds?: number[];

  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  clientIds?: number[];

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Transform(({ value }) => valueToBool(value))
  @IsBoolean()
  withBids?: boolean;

  @IsOptional()
  @Transform(({ value }) => valueToBool(value))
  @IsBoolean()
  withWorker?: boolean;
}

export class StationsGetListResponseBodyDTO extends PaginationResponseDTO<StationDTO> {
  constructor(data: StationsGetListResponseBodyDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map((item) => new StationDTO(item));
  }
}

export class StationStatisticDTO {
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
