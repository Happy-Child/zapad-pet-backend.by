import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'o2m_client_to_station_workers' })
export class O2MClientToStationWorkers extends BaseEntity {
  @Column({ nullable: false })
  @Expose()
  clientId!: number;

  @Column({ nullable: false })
  @Expose()
  stationWorkerId!: number;
}
