import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ArrayWithObjects, UniqueArrayByExistField } from '@app/decorators';
import { STATIONS_ERRORS } from '../constants/stations-errors.constants';
import { NonEmptyArray } from '@app/types';
import { STATION_NUMBER_LENGTH } from '../constants';

export class StationsCreateItemDTO {
  @IsString()
  @Length(STATION_NUMBER_LENGTH, STATION_NUMBER_LENGTH)
  number!: string;

  @IsInt()
  clientId!: number;

  @IsInt()
  districtId!: number;

  @IsOptional()
  @IsInt()
  stationWorkerId?: number;
}

export class StationsCreateRequestBodyDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayWithObjects()
  @UniqueArrayByExistField<StationsCreateItemDTO>(
    'number',
    STATIONS_ERRORS.STATIONS_NUMBERS_SHOULD_BY_UNIQUE,
  )
  @UniqueArrayByExistField<StationsCreateItemDTO>(
    'stationWorkerId',
    STATIONS_ERRORS.STATION_WORKERS_ID_SHOULD_BY_UNIQUE,
  )
  @ValidateNested({ each: true })
  @Type(() => StationsCreateItemDTO)
  stations!: NonEmptyArray<StationsCreateItemDTO>;
}
