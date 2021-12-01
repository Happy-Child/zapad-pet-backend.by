import {
  ArrayNotEmpty,
  IsArray,
  IsDateString,
  IsEnum,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  ArrayWithObjects,
  MinDateWithFormatter,
  NullOrNumber,
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
import { NullOrString } from '@app/decorators/null-or-string.decorators';

export class BidsCreateTodoDTO {
  @IsString()
  @Length(1, BID_TODO_MAX_LENGTH)
  text!: string;
}

export class BidsCreateBodyDTO {
  @IsEnum(BID_PRIORITY)
  priority!: BID_PRIORITY;

  @NullOrString()
  description!: string | null;

  @NullOrNumber()
  imageFileId!: number | null;

  @IsDateString()
  @MinDateWithFormatter(GET_BID_MIN_DATE_START_OF_DEADLINE, (unknownDate) =>
    moment(unknownDate).toDate(),
  )
  deadlineAt!: string;

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
