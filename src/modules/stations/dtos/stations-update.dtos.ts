import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { NonEmptyArray } from '@app/types';
import {
  ArrayWithObjects,
  NullOrNumber,
  UniqueArrayByExistField,
} from '@app/decorators';
import { GENERAL_ERRORS } from '@app/constants';
import { STATIONS_ERRORS } from '@app/constants/errors/stations-errors.constants';
import { STATION_NUMBER_LENGTH } from '../constants';

export class StationsUpdateItemDTO {
  @IsInt()
  id!: number;

  @IsString()
  @Length(STATION_NUMBER_LENGTH, STATION_NUMBER_LENGTH)
  number!: string;

  @IsInt()
  clientId!: number;

  @IsInt()
  districtId!: number;

  @NullOrNumber()
  stationWorkerId!: number | null;
}

export class StationsUpdateRequestBodyDTO {
  @IsArray()
  @ArrayNotEmpty()
  @ArrayWithObjects()
  @UniqueArrayByExistField<StationsUpdateItemDTO>(
    'id',
    GENERAL_ERRORS.ID_SHOULD_BE_UNIQUES,
  )
  @UniqueArrayByExistField<StationsUpdateItemDTO>(
    'number',
    STATIONS_ERRORS.STATIONS_NUMBERS_SHOULD_BY_UNIQUE,
  )
  @UniqueArrayByExistField<StationsUpdateItemDTO>(
    'stationWorkerId',
    STATIONS_ERRORS.STATION_WORKERS_ID_SHOULD_BY_UNIQUE,
  )
  @ValidateNested({ each: true })
  @Type(() => StationsUpdateItemDTO)
  stations!: NonEmptyArray<StationsUpdateItemDTO>;
}
