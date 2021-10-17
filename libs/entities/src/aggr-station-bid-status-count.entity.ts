import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { StationEntity } from './station.entity';
import { BaseEntity } from './base.entity';
import { BID_STATUS } from '../../../src/modules/bids/constants';
import { Expose } from 'class-transformer';

@Entity({ name: 'aggr_station_bid_status_count' })
export class AggrStationBidStatusCountEntity extends BaseEntity {
  @Column({ nullable: false })
  @Expose()
  stationId!: number;

  @OneToOne(() => StationEntity)
  @JoinColumn({
    name: 'stationId',
    referencedColumnName: 'id',
  })
  @Expose()
  station?: StationEntity;

  @Column({ nullable: false, default: 0 })
  @Expose()
  [BID_STATUS.EDITING]!: number;

  @Column({ nullable: false, default: 0 })
  @Expose()
  [BID_STATUS.PENDING_ASSIGNMENT_TO_ENGINEER]!: number;

  @Column({ nullable: false, default: 0 })
  @Expose()
  [BID_STATUS.PENDING_START_WORK_FROM_ENGINEER]!: number;

  @Column({ nullable: false, default: 0 })
  @Expose()
  [BID_STATUS.IN_WORK]!: number;

  @Column({ nullable: false, default: 0 })
  @Expose()
  [BID_STATUS.PENDING_REVIEW_FROM_DISTRICT_LEADER]!: number;

  @Column({ nullable: false, default: 0 })
  @Expose()
  [BID_STATUS.PENDING_REVIEW_FROM_STATION_WORKER]!: number;

  @Column({ nullable: false, default: 0 })
  @Expose()
  [BID_STATUS.FAIL_REVIEW_FROM_DISTRICT_LEADER]!: number;

  @Column({ nullable: false, default: 0 })
  @Expose()
  [BID_STATUS.FAIL_REVIEW_FROM_STATION_WORKER]!: number;

  @Column({ nullable: false, default: 0 })
  @Expose()
  [BID_STATUS.COMPLETED]!: number;

  @Column({ nullable: false, default: 0 })
  @Expose()
  [BID_STATUS.REJECTED]!: number;
}
