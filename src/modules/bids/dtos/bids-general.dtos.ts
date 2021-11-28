import { Expose, Transform } from 'class-transformer';
import { BID_STATUS } from '../constants';

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
