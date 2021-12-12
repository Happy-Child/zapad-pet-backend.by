import { IsIn, IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BID_TODO_STATUS } from '../constants';
import { MAX_INTEGER } from '@app/constants';
import { ApiProperty } from '@nestjs/swagger';

export class BidsTodosChangeStatusParamsDTO {
  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(MAX_INTEGER)
  @Type(() => Number)
  bidId!: number;

  @ApiProperty()
  @IsInt()
  @Min(1)
  @Max(MAX_INTEGER)
  @Type(() => Number)
  todoId!: number;

  @ApiProperty({ enum: [BID_TODO_STATUS.IN_WORK, BID_TODO_STATUS.COMPLETED] })
  @IsIn([BID_TODO_STATUS.IN_WORK, BID_TODO_STATUS.COMPLETED])
  nextStatus!: BID_TODO_STATUS.IN_WORK | BID_TODO_STATUS.COMPLETED;
}
