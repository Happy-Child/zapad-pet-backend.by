import { PaginationRequestDTO } from '@app/dtos';
import {
  ArrayUnique,
  IsDateString,
  IsEnum,
  IsIn,
  IsOptional,
  IsString,
  ValidateIf,
} from 'class-validator';
import { SORT_DURATION } from '@app/constants';
import {
  BIDS_DATE_DISTRICT_LEADER_RANGES,
  BIDS_DATE_ENGINEER_RANGES,
  BIDS_DATE_GENERAL_RANGES,
  BIDS_DATE_MASTER_RANGES,
  BIDS_DATE_STATION_WORKER_RANGES,
  BIDS_DISTRICT_LEADER_SORT_BY,
  BIDS_ENGINEER_SORT_BY,
  BIDS_MASTER_SORT_BY,
  BIDS_STATION_WORKER_SORT_BY,
} from '../../constants';
import { Transform, Type } from 'class-transformer';
import { BID_PRIORITY, BID_STATUS } from '../../constants';
import { ApiProperty } from '@nestjs/swagger';

export class GetListBidsGeneralQueryDTO extends PaginationRequestDTO {
  @ApiProperty({ required: false, enum: SORT_DURATION })
  @IsOptional()
  @IsEnum(SORT_DURATION)
  sortDuration?: SORT_DURATION;

  @ApiProperty({ required: false, isArray: true, enum: BID_STATUS })
  @IsOptional()
  @ArrayUnique()
  @IsIn(Object.values(BID_STATUS), { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: BID_STATUS[];

  @ApiProperty({ required: false, isArray: true, enum: BID_PRIORITY })
  @IsOptional()
  @ArrayUnique()
  @IsIn(Object.values(BID_PRIORITY), { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  priority?: BID_PRIORITY[];

  @ApiProperty({
    required: false,
    type: Date,
    example: '2021-10-05 15:00:00.000',
  })
  @IsOptional()
  @IsDateString()
  dateRangeFrom?: string;

  @ApiProperty({
    required: false,
    type: Date,
    example: '2021-12-25 18:30:00.000',
  })
  @IsOptional()
  @IsDateString()
  dateRangeTo?: string;
}

export class GetListBidsEngineerQueryDTO extends GetListBidsGeneralQueryDTO {
  @ApiProperty({ required: false, enum: BIDS_ENGINEER_SORT_BY })
  @IsOptional()
  @IsIn(BIDS_ENGINEER_SORT_BY)
  sortBy?: typeof BIDS_ENGINEER_SORT_BY[number];

  @ApiProperty({ required: false, enum: BIDS_DATE_GENERAL_RANGES })
  @ValidateIf((data) => data.dateRangeTo || data.dateRangeFrom)
  @IsIn(BIDS_DATE_GENERAL_RANGES)
  dateRangeType?: typeof BIDS_DATE_ENGINEER_RANGES[number];
}

export class GetListBidsDistrictLeaderQueryDTO extends GetListBidsGeneralQueryDTO {
  @ApiProperty({ required: false, enum: BIDS_DISTRICT_LEADER_SORT_BY })
  @IsOptional()
  @IsIn(BIDS_DISTRICT_LEADER_SORT_BY)
  sortBy?: typeof BIDS_DISTRICT_LEADER_SORT_BY[number];

  @ApiProperty({ required: false, enum: BIDS_DATE_DISTRICT_LEADER_RANGES })
  @ValidateIf((data) => data.dateRangeTo || data.dateRangeFrom)
  @IsIn(BIDS_DATE_DISTRICT_LEADER_RANGES)
  dateRangeType?: typeof BIDS_DATE_DISTRICT_LEADER_RANGES[number];

  @ApiProperty({ required: false, isArray: true, type: Number })
  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  engineersIds?: number[];
}

export class GetListBidsStationWorkerQueryDTO extends GetListBidsGeneralQueryDTO {
  @ApiProperty({ required: false, enum: BIDS_STATION_WORKER_SORT_BY })
  @IsOptional()
  @IsIn(BIDS_STATION_WORKER_SORT_BY)
  sortBy?: typeof BIDS_STATION_WORKER_SORT_BY[number];

  @ApiProperty({ required: false, enum: BIDS_DATE_STATION_WORKER_RANGES })
  @ValidateIf((data) => data.dateRangeTo || data.dateRangeFrom)
  @IsIn(BIDS_DATE_STATION_WORKER_RANGES)
  dateRangeType?: typeof BIDS_DATE_STATION_WORKER_RANGES[number];
}

export class GetListBidsMasterQueryDTO extends GetListBidsGeneralQueryDTO {
  @ApiProperty({ required: false, enum: BIDS_MASTER_SORT_BY })
  @IsOptional()
  @IsIn(BIDS_MASTER_SORT_BY)
  sortBy?: typeof BIDS_MASTER_SORT_BY[number];

  @ApiProperty({ required: false, type: String })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false, enum: BIDS_DATE_MASTER_RANGES })
  @ValidateIf((data) => data.dateRangeTo || data.dateRangeFrom)
  @IsIn(BIDS_DATE_MASTER_RANGES)
  dateRangeType?: typeof BIDS_DATE_MASTER_RANGES[number];

  @ApiProperty({ required: false, isArray: true, type: Number })
  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  districtIds?: number[];

  @ApiProperty({ required: false, isArray: true, type: Number })
  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  stationsIds?: number[];

  @ApiProperty({ required: false, isArray: true, type: Number })
  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  clientIds?: number[];

  @ApiProperty({ required: false, isArray: true, type: Number })
  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  engineersIds?: number[];

  @ApiProperty({ required: false, isArray: true, type: Number })
  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  stationsWorkersIds?: number[];

  @ApiProperty({ required: false, isArray: true, type: Number })
  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  districtsLeadersIds?: number[];
}

export type TGetListBidsQueryDTO =
  | GetListBidsEngineerQueryDTO
  | GetListBidsDistrictLeaderQueryDTO
  | GetListBidsMasterQueryDTO
  | GetListBidsStationWorkerQueryDTO;
