import { Entity, Column, OneToOne, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Expose } from 'class-transformer';
import { UserEntity } from './user.entity';
import { StationEntity } from '@app/entities/station.entity';
import { ClientEntity } from '@app/entities/client.entity';

@Entity({ name: 'stations_workers' })
export class StationWorkerEntity extends BaseEntity {
  @Column({ nullable: false, unique: true })
  @Expose()
  userId!: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  @Expose()
  user!: UserEntity;

  @Column({ nullable: false })
  @Expose()
  clientId!: number;

  @ManyToOne(() => ClientEntity, (client) => client.stationsWorkers)
  @JoinColumn({
    name: 'clientId',
    referencedColumnName: 'id',
  })
  @Expose()
  client!: ClientEntity;

  @Column({ nullable: true, unique: true })
  @Expose()
  stationId!: number | null;

  @OneToOne(() => StationEntity)
  @JoinColumn({
    name: 'stationId',
    referencedColumnName: 'id',
  })
  @Expose()
  station!: StationEntity | null;
}
