import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Length,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  ArrayWithObjects,
  MinDateWithFormatter,
  NullOrNumber,
  UniqueArrayByExistField,
} from '@app/decorators';
import {
  GET_BID_MIN_DATE_START_OF_DEADLINE,
  BID_PRIORITY,
  BID_TODO_MAX_LENGTH,
  BID_EDITABLE_STATUS,
} from '../constants';
import moment from 'moment';
import { BIDS_ERRORS, MAX_INTEGER } from '@app/constants';
import { NullOrString } from '@app/decorators/null-or-string.decorators';

export class BidsUpdateTodoDTO {
  @IsString()
  @Length(1, BID_TODO_MAX_LENGTH)
  text!: string;
}

export class BidsUpdateBodyDTO {
  @IsOptional()
  @NullOrNumber()
  imageFileId?: number | null;

  @IsOptional()
  @IsEnum(BID_PRIORITY)
  priority?: BID_PRIORITY;

  @IsOptional()
  @NullOrString()
  description?: string | null;

  @IsOptional()
  @IsDateString()
  @MinDateWithFormatter(GET_BID_MIN_DATE_START_OF_DEADLINE, (unknownDate) =>
    moment(unknownDate).toDate(),
  )
  deadlineAt?: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayWithObjects()
  @UniqueArrayByExistField<BidsUpdateTodoDTO>(
    'text',
    BIDS_ERRORS.BID_TODO_DESC_SHOULD_BE_UNIQUE,
  )
  @ValidateNested({ each: true })
  @Type(() => BidsUpdateTodoDTO)
  todos?: BidsUpdateTodoDTO[];
}

export class BidsChangeEditableStatusParamsDTO {
  @IsInt()
  @Min(1)
  @Max(MAX_INTEGER)
  @Type(() => Number)
  bidId!: number;

  @IsBoolean()
  @Transform(
    ({ value }) =>
      value === true || String(value) === BID_EDITABLE_STATUS.EDITABLE,
  )
  isEditable!: boolean;
}

export class BidsEndWorkRequestBodyDTO {
  @NullOrNumber()
  imageFileId!: number;
}
