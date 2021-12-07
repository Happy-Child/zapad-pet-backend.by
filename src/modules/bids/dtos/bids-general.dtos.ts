import { Expose, Transform } from 'class-transformer';
import { BID_PRIORITY, BID_STATUS, BID_TODO_STATUS } from '../constants';
import { IStorageFile } from '@app/file-storage/interfaces';

export class BidsCountByStatusesDTO {
  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.EDITING]!: number;

  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.PENDING_ASSIGNMENT_TO_ENGINEER]!: number;

  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.PENDING_START_WORK_FROM_ENGINEER]!: number;

  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.IN_WORK]!: number;

  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.PENDING_REVIEW_FROM_DISTRICT_LEADER]!: number;

  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.PENDING_REVIEW_FROM_STATION_WORKER]!: number;

  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.FAIL_REVIEW_FROM_DISTRICT_LEADER]!: number;

  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.FAIL_REVIEW_FROM_STATION_WORKER]!: number;

  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.COMPLETED]!: number;

  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.CANCEL]!: number;
}

export class BidDTO {
  @Expose()
  id!: number;

  @Expose()
  status!: BID_STATUS;

  @Expose()
  priority!: BID_PRIORITY;

  @Expose()
  description!: string | null;

  @Expose()
  deadlineAt!: string;

  @Expose()
  image!: IStorageFile;
}

export class BidTodoDTO {
  @Expose()
  id!: number;

  @Expose()
  text!: string;

  @Expose()
  status!: BID_TODO_STATUS;
}
