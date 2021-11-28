import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ArrayWithObjects,
  MinDateWithFormatter,
  UniqueArrayByExistField,
} from '@app/decorators';
import { NonEmptyArray } from '@app/types';
import { BIDS_ERRORS } from '@app/constants';
import {
  GET_BID_MIN_DATE_START_OF_DEADLINE,
  BID_PRIORITY,
  BID_TODO_MAX_LENGTH,
} from '../constants';
import moment from 'moment';

export class BidsCreateTodoDTO {
  @IsString()
  @Length(1, BID_TODO_MAX_LENGTH)
  text!: string;
}

export class BidsCreateBodyDTO {
  @IsEnum(BID_PRIORITY)
  priority!: BID_PRIORITY;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsDateString()
  @MinDateWithFormatter(GET_BID_MIN_DATE_START_OF_DEADLINE, (unknownDate) =>
    moment(unknownDate).toDate(),
  )
  deadlineAt!: Date;

  @IsArray()
  @ArrayNotEmpty()
  @ArrayWithObjects()
  @UniqueArrayByExistField<BidsCreateTodoDTO>(
    'text',
    BIDS_ERRORS.BID_TODO_DESC_SHOULD_BE_UNIQUE,
  )
  @ValidateNested({ each: true })
  @Type(() => BidsCreateTodoDTO)
  todos!: NonEmptyArray<BidsCreateTodoDTO>;
}
