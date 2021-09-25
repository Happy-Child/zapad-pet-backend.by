import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import {
  BaseEntity,
  UserEntity,
  DistrictEntity,
  BidEntity,
  ClientEntity,
} from '@app/entities';
import { STATION_NUMBER_LENGTH } from '../constants';

@Entity({ name: 'station' })
export class StationEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: STATION_NUMBER_LENGTH,
    nullable: false,
    unique: true,
  })
  number!: string;

  @Column({ nullable: true })
  stationWorkerId?: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({
    name: 'stationWorkerId',
    referencedColumnName: 'id',
  })
  stationWorker?: UserEntity;

  @Column({ nullable: false })
  clientId!: number;

  @ManyToOne(() => ClientEntity)
  @JoinColumn({
    name: 'clientId',
    referencedColumnName: 'id',
  })
  client?: ClientEntity;

  @Column({ nullable: false })
  districtId!: number;

  @OneToOne(() => DistrictEntity)
  @JoinColumn({
    name: 'districtId',
    referencedColumnName: 'id',
  })
  district?: DistrictEntity;

  @OneToMany(() => BidEntity, (bid) => bid.station)
  bids?: BidEntity[];
}
