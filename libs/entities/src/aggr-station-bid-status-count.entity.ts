import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { StationEntity } from './station.entity';
import { BaseEntity } from './base.entity';

@Entity({ name: 'aggr_station_bid_status_count' })
export class AggrStationBidStatusCountEntity extends BaseEntity {
  @Column({ nullable: false })
  stationId!: number;

  @OneToOne(() => StationEntity)
  @JoinColumn({
    name: 'stationId',
    referencedColumnName: 'id',
  })
  station?: StationEntity;

  @Column({ nullable: false, default: 0 })
  pendingInWork!: number;

  @Column({ nullable: false, default: 0 })
  inWork!: number;

  @Column({ nullable: false, default: 0 })
  editing!: number;

  @Column({ nullable: false, default: 0 })
  completed!: number;

  @Column({ nullable: false, default: 0 })
  rejected!: number;

  @Column({ nullable: false, default: 0 })
  pendingVerificationStationWorker!: number;

  @Column({ nullable: false, default: 0 })
  pendingVerificationDistrictLeader!: number;

  @Column({ nullable: false, default: 0 })
  notAcceptedStationWorker!: number;

  @Column({ nullable: false, default: 0 })
  notAcceptedDistrictLeader!: number;
}
