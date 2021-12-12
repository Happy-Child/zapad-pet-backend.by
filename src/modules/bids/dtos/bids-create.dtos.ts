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
import { ApiProperty } from '@nestjs/swagger';

export class BidsCreateTodoDTO {
  @ApiProperty({
    type: String,
    required: true,
  })
  @IsString()
  @Length(1, BID_TODO_MAX_LENGTH)
  text!: string;
}

export class BidsCreateBodyDTO {
  @ApiProperty({
    required: true,
    enum: BID_PRIORITY,
  })
  @IsEnum(BID_PRIORITY)
  priority!: BID_PRIORITY;

  @ApiProperty({
    type: String,
    required: true,
    nullable: true,
  })
  @NullOrString()
  description!: string | null;

  @ApiProperty({
    type: Number,
    required: true,
    nullable: true,
  })
  @NullOrNumber()
  imageFileId!: number | null;

  @ApiProperty({
    type: String,
    required: true,
    example: '2021-12-30 15:00:00.000',
  })
  @IsDateString()
  @MinDateWithFormatter(GET_BID_MIN_DATE_START_OF_DEADLINE, (unknownDate) =>
    moment(unknownDate).toDate(),
  )
  deadlineAt!: string;

  @ApiProperty({
    type: BidsCreateTodoDTO,
    required: true,
    isArray: true,
  })
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
