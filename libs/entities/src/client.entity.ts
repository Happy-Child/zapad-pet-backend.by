import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { Expose } from 'class-transformer';
import { StationWorkerEntity } from '@app/entities/stations-workers.entity';
import { StationEntity } from '@app/entities/station.entity';

@Entity({ name: 'client' })
export class ClientEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  @Expose()
  name!: string;

  @OneToMany(() => StationWorkerEntity, (worker) => worker.client)
  stationsWorkers!: StationWorkerEntity[];

  @OneToMany(() => StationEntity, (station) => station.client)
  stations!: StationEntity[];
}
