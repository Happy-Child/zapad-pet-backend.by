import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { plainToClass } from 'class-transformer';
import { BaseEntity } from '@app/entities';
import { Station } from './station.entity';

@Entity({ name: 'aggr_station_bid_status_count' })
export class AggrStationBidStatusCount extends BaseEntity {
  @Column({ nullable: false })
  stationId!: number;

  @OneToOne(() => Station)
  @JoinColumn({
    name: 'stationId',
    referencedColumnName: 'id',
  })
  station!: Station;

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

  constructor(data: Partial<AggrStationBidStatusCount>) {
    super();
    Object.assign(this, plainToClass(AggrStationBidStatusCount, data));
  }
}
