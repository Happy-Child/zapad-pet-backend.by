import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { BaseEntity, UserEntity, District, Bid, Client } from '@app/entities';
import { plainToClass } from 'class-transformer';
import { STATION_NUMBER_LENGTH } from '../constants';

@Entity({ name: 'station' })
export class Station extends BaseEntity {
  @Column({
    type: 'varchar',
    length: STATION_NUMBER_LENGTH,
    nullable: false,
    unique: true,
  })
  number!: string;

  @Column({ nullable: true })
  stationWorkerId!: number | null;

  @OneToOne(() => UserEntity)
  @JoinColumn({
    name: 'stationWorkerId',
    referencedColumnName: 'id',
  })
  stationWorker!: UserEntity | null;

  @Column({ nullable: false })
  clientId!: number;

  @ManyToOne(() => Client)
  @JoinColumn({
    name: 'clientId',
    referencedColumnName: 'id',
  })
  client!: Client;

  @Column({ nullable: false })
  districtId!: number;

  @OneToOne(() => District)
  @JoinColumn({
    name: 'districtId',
    referencedColumnName: 'id',
  })
  district!: District;

  @OneToMany(() => Bid, (bid) => bid.station)
  bids!: Bid[];

  constructor(data: Partial<Station>) {
    super();
    Object.assign(this, plainToClass(Station, data));
  }
}
