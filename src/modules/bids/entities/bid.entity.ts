import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { plainToClass } from 'class-transformer';
import { BaseEntity, UserEntity, Station, File } from '@app/entities';
import { BidTodo } from './bid-todo.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { BID_PRIORITY, BID_STATUS } from '../constants';

@Entity({ name: 'bid' })
export class Bid extends BaseEntity {
  @Column({
    type: 'enum',
    enum: BID_STATUS,
    nullable: false,
    default: BID_STATUS.PENDING_IN_WORK,
  })
  status!: BID_STATUS;

  @Column({
    type: 'enum',
    enum: BID_PRIORITY,
    nullable: false,
    default: BID_PRIORITY.MEDIUM,
  })
  priority!: BID_PRIORITY;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: true,
  })
  description!: string | null;

  @Column({ nullable: false })
  stationId!: number;

  @ManyToOne(() => Station, (station) => station.bids)
  @JoinColumn({
    name: 'stationId',
    referencedColumnName: 'id',
  })
  station!: Station;

  @Column({ nullable: true })
  engineerId!: number | null;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'engineerId',
    referencedColumnName: 'id',
  })
  engineer!: UserEntity | null;

  @Column({ nullable: true })
  rejectedUserId!: number | null;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'rejectedUserId',
    referencedColumnName: 'id',
  })
  rejectedUser!: UserEntity | null;

  @Column({ nullable: true })
  confirmedStationWorkerId!: number | null;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'confirmedStationWorkerId',
    referencedColumnName: 'id',
  })
  confirmedStationWorker!: UserEntity | null;

  @Column({ nullable: true })
  finalPhotoId!: number | null;

  @OneToOne(() => File)
  @JoinColumn({
    name: 'finalPhotoId',
    referencedColumnName: 'id',
  })
  finalPhoto!: File | null;

  @OneToMany(() => BidTodo, (todo) => todo.bid)
  todos!: BidTodo[];

  @CreateDateColumn({ type: 'timestamptz', nullable: false })
  deadlineAt!: Date;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  startWorkAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  endWorkAt!: Date | null;

  @CreateDateColumn({ type: 'timestamptz', nullable: true })
  confirmSuccessAt!: Date | null;

  constructor(data: Partial<Bid>) {
    super();
    Object.assign(this, plainToClass(Bid, data));
  }
}
