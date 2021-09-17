import {
  Entity,
  Column,
  OneToOne,
  JoinColumn,
  OneToMany,
  ManyToOne,
} from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { STATION_NUMBER_LENGTH } from '@app/constants';
import { plainToClass } from 'class-transformer';
import { User } from '@app/entities/user.entity';
import { District } from '@app/entities/district.entity';
import { Bid } from '@app/entities/bid.entity';
import { Client } from '@app/entities/client.entity';

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
  stationWorkerId!: number;

  @OneToOne(() => User)
  @JoinColumn({
    name: 'stationWorkerId',
    referencedColumnName: 'id',
  })
  stationWorker!: User | null;

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
