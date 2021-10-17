import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { STATION_NUMBER_LENGTH } from '../../../src/modules/stations/constants';
import { BidEntity } from '@app/entities/bid.entity';
import { ClientEntity } from '@app/entities/client.entity';

@Entity({ name: 'station' })
export class StationEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: STATION_NUMBER_LENGTH,
    nullable: false,
    unique: true,
  })
  number!: string;

  @Column({ nullable: false })
  clientId!: number;

  @ManyToOne(() => ClientEntity, (client) => client.stations)
  @JoinColumn({
    name: 'clientId',
    referencedColumnName: 'id',
  })
  client!: ClientEntity;

  @Column({ nullable: false })
  districtId!: number;

  @OneToMany(() => BidEntity, (bid) => bid.station)
  bids?: BidEntity[];
}
