import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@app/entities';
import { STATION_NUMBER_LENGTH } from '../constants';
import { BidEntity } from '../../bids';

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

  @Column({ nullable: false })
  districtId!: number;

  @OneToMany(() => BidEntity, (bid) => bid.station)
  bids?: BidEntity[];
}
