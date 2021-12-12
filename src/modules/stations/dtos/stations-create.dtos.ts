import { Type } from 'class-transformer';
import { NonEmptyArray } from '@app/types';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import {
  ArrayWithObjects,
  NullOrNumber,
  UniqueArrayByExistField,
} from '@app/decorators';
import { STATION_NUMBER_LENGTH } from '../constants';
import { STATIONS_ERRORS } from '@app/constants';
import { ApiProperty } from '@nestjs/swagger';

export class StationsCreateItemDTO {
  @ApiProperty()
  @IsString()
  @Length(STATION_NUMBER_LENGTH, STATION_NUMBER_LENGTH)
  number!: string;

  @ApiProperty()
  @IsInt()
  clientId!: number;

  @ApiProperty()
  @IsInt()
  districtId!: number;

  @ApiProperty({ type: Number, nullable: true })
  @NullOrNumber()
  stationWorkerId!: number | null;
}

export class StationsCreateRequestBodyDTO {
  @ApiProperty({ type: StationsCreateItemDTO, isArray: true })
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
