import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { Expose } from 'class-transformer';
import { ClientEntity } from './client.entity';
import { UserEntity } from '../../users/entities';

@Entity({ name: 'clients_to_station_workers' })
export class ClientsToStationWorkersEntity extends BaseEntity {
  @Column({ nullable: false })
  @Expose()
  clientId!: number;

  @ManyToOne(() => ClientEntity)
  @JoinColumn({
    name: 'clientId',
    referencedColumnName: 'id',
  })
  @Expose()
  client?: ClientEntity;

  @Column({ nullable: false, unique: true })
  @Expose()
  stationWorkerId!: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({
    name: 'stationWorkerId',
    referencedColumnName: 'id',
  })
  @Expose()
  stationWorker?: UserEntity;
}
