import { Entity, Column, OneToMany, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { STATION_NUMBER_LENGTH } from '../../../src/modules/stations/constants';
import { IsInt, IsString, Length } from 'class-validator';
import { BidEntity } from '@app/entities/bid.entity';
import { ClientEntity } from '@app/entities/client.entity';

@Entity({ name: 'station' })
export class StationEntity extends BaseEntity {
  @IsString()
  @Length(STATION_NUMBER_LENGTH, STATION_NUMBER_LENGTH)
  @Column({
    type: 'varchar',
    length: STATION_NUMBER_LENGTH,
    nullable: false,
    unique: true,
  })
  number!: string;

  @IsInt()
  @Column({ nullable: false })
  clientId!: number;

  @ManyToOne(() => ClientEntity, (client) => client.stations)
  @JoinColumn({
    name: 'clientId',
    referencedColumnName: 'id',
  })
  client!: ClientEntity;

  @IsInt()
  @Column({ nullable: false })
  districtId!: number;

  @OneToMany(() => BidEntity, (bid) => bid.station)
  bids?: BidEntity[];
}
