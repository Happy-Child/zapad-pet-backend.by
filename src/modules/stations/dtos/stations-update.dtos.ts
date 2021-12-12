import { Type } from 'class-transformer';
import { ArrayNotEmpty, IsArray, IsInt, ValidateNested } from 'class-validator';
import { NonEmptyArray } from '@app/types';
import { ArrayWithObjects, UniqueArrayByExistField } from '@app/decorators';
import { GENERAL_ERRORS } from '@app/constants';
import { STATIONS_ERRORS } from '@app/constants/errors/stations-errors.constants';
import { ApiProperty } from '@nestjs/swagger';
import { StationsCreateItemDTO } from './stations-create.dtos';

export class StationsUpdateItemDTO extends StationsCreateItemDTO {
  @ApiProperty()
  @IsInt()
  id!: number;
}

export class StationsUpdateRequestBodyDTO {
  @ApiProperty({ type: StationsUpdateItemDTO, isArray: true })
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
