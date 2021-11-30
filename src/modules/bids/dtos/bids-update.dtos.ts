import {
  ArrayNotEmpty,
  IsArray,
  IsBoolean,
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  Length,
  ValidateNested,
} from 'class-validator';
import { Transform, Type } from 'class-transformer';
import {
  ArrayWithObjects,
  MinDateWithFormatter,
  UniqueArrayByExistField,
} from '@app/decorators';
import {
  GET_BID_MIN_DATE_START_OF_DEADLINE,
  BID_PRIORITY,
  BID_TODO_MAX_LENGTH,
  BID_EDITABLE_STATUS,
} from '../constants';
import moment from 'moment';
import { IdParamDTO } from '@app/dtos';
import { BIDS_ERRORS } from '@app/constants';

export class BidsUpdateTodoDTO {
  @IsString()
  @Length(1, BID_TODO_MAX_LENGTH)
  text!: string;
}

export class BidsUpdateBodyDTO {
  @IsOptional()
  @IsEnum(BID_PRIORITY)
  priority?: BID_PRIORITY;

  @IsOptional()
  @IsString()
  description?: string | null;

  @IsOptional()
  @IsDateString()
  @MinDateWithFormatter(GET_BID_MIN_DATE_START_OF_DEADLINE, (unknownDate) =>
    moment(unknownDate).toDate(),
  )
  deadlineAt?: Date;

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

export class BidsChangeEditableStatusParamsDTO extends IdParamDTO {
  @IsBoolean()
  @Transform(
    ({ value }) =>
      value === true || String(value) === BID_EDITABLE_STATUS.EDITABLE,
  )
  isEditable!: boolean;
}
