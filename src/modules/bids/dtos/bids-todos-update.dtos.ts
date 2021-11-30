import { IsIn, IsInt, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';
import { BID_TODO_STATUS } from '../constants';
import { MAX_INTEGER } from '@app/constants';

export class BidsTodosChangeStatusParamsDTO {
  @IsInt()
  @Min(1)
  @Max(MAX_INTEGER)
  @Type(() => Number)
  bidId!: number;

  @IsInt()
  @Min(1)
  @Max(MAX_INTEGER)
  @Type(() => Number)
  todoId!: number;

  @IsIn([BID_TODO_STATUS.IN_WORK, BID_TODO_STATUS.COMPLETED])
  status!: BID_TODO_STATUS.IN_WORK | BID_TODO_STATUS.COMPLETED;
}
