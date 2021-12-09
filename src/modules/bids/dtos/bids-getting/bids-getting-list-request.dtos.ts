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

export class GetListBidsGeneralQueryDTO extends PaginationRequestDTO {
  @IsOptional()
  @IsEnum(SORT_DURATION)
  sortDuration?: SORT_DURATION;

  @IsOptional()
  @ArrayUnique()
  @IsIn(Object.values(BID_STATUS), { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  status?: BID_STATUS[];

  @IsOptional()
  @ArrayUnique()
  @IsIn(Object.values(BID_PRIORITY), { each: true })
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  priority?: BID_PRIORITY[];

  @IsOptional()
  @IsDateString()
  dateRangeFrom?: string;

  @IsOptional()
  @IsDateString()
  dateRangeTo?: string;
}

export class GetListBidsEngineerQueryDTO extends GetListBidsGeneralQueryDTO {
  @IsOptional()
  @IsIn(BIDS_ENGINEER_SORT_BY)
  sortBy?: typeof BIDS_ENGINEER_SORT_BY[number];

  @ValidateIf((data) => data.dateRangeTo || data.dateRangeFrom)
  @IsIn(BIDS_DATE_GENERAL_RANGES)
  dateRangeType?: typeof BIDS_DATE_ENGINEER_RANGES[number];
}

export class GetListBidsDistrictLeaderQueryDTO extends GetListBidsGeneralQueryDTO {
  @IsOptional()
  @IsIn(BIDS_DISTRICT_LEADER_SORT_BY)
  sortBy?: typeof BIDS_DISTRICT_LEADER_SORT_BY[number];

  @ValidateIf((data) => data.dateRangeTo || data.dateRangeFrom)
  @IsIn(BIDS_DATE_DISTRICT_LEADER_RANGES)
  dateRangeType?: typeof BIDS_DATE_DISTRICT_LEADER_RANGES[number];

  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  engineersIds?: number[];
}

export class GetListBidsStationWorkerQueryDTO extends GetListBidsGeneralQueryDTO {
  @IsOptional()
  @IsIn(BIDS_STATION_WORKER_SORT_BY)
  sortBy?: typeof BIDS_STATION_WORKER_SORT_BY[number];

  @ValidateIf((data) => data.dateRangeTo || data.dateRangeFrom)
  @IsIn(BIDS_DATE_STATION_WORKER_RANGES)
  dateRangeType?: typeof BIDS_DATE_STATION_WORKER_RANGES[number];
}

export class GetListBidsMasterQueryDTO extends GetListBidsGeneralQueryDTO {
  @IsOptional()
  @IsIn(BIDS_MASTER_SORT_BY)
  sortBy?: typeof BIDS_MASTER_SORT_BY[number];

  @IsOptional()
  @IsString()
  search?: string;

  @ValidateIf((data) => data.dateRangeTo || data.dateRangeFrom)
  @IsIn(BIDS_DATE_MASTER_RANGES)
  dateRangeType?: typeof BIDS_DATE_MASTER_RANGES[number];

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
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  engineersIds?: number[];

  @IsOptional()
  @ArrayUnique()
  @Transform(({ value }) => (Array.isArray(value) ? value : [value]))
  @Type(() => Number)
  stationsWorkersIds?: number[];

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
