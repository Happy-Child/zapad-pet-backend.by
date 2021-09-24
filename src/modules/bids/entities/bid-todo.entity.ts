import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { Expose } from 'class-transformer';
import { BID_TODO_MAX_LENGTH, BID_TODO_STATUS } from '../constants';
import { Bid } from './bid.entity';

@Entity({ name: 'bid_todo' })
export class BidTodo extends BaseEntity {
  @Column({
    type: 'varchar',
    length: BID_TODO_MAX_LENGTH,
    nullable: false,
  })
  @Expose()
  text!: string;

  @Column({
    type: 'enum',
    enum: BID_TODO_STATUS,
    nullable: false,
    default: BID_TODO_STATUS.PENDING,
  })
  @Expose()
  status!: BID_TODO_STATUS;

  @Column({ nullable: false })
  bidId!: number;

  @ManyToOne(() => Bid)
  @JoinColumn({
    name: 'bidId',
    referencedColumnName: 'id',
  })
  @Expose()
  bid!: Bid;
}
