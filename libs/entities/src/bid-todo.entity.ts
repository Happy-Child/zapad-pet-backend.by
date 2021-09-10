import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { plainToClass } from 'class-transformer';
import { BID_TODO_STATUS } from '@app/constants';
import { Bid } from '@app/entities';
import { BID_TODO_MAX_LENGTH } from '@app/constants';

@Entity({ name: 'bid_todo' })
export class BidTodo extends BaseEntity {
  @Column({
    type: 'varchar',
    length: BID_TODO_MAX_LENGTH,
    nullable: false,
  })
  text: string;

  @Column({
    type: 'enum',
    enum: BID_TODO_STATUS,
    nullable: false,
    default: BID_TODO_STATUS.PENDING,
  })
  status: BID_TODO_STATUS;

  @Column({ nullable: false })
  bidId: number;

  @ManyToOne(() => Bid)
  @JoinColumn({
    name: 'bidId',
    referencedColumnName: 'id',
  })
  bid: Bid;

  constructor(data: Partial<BidTodo>) {
    super();
    Object.assign(this, plainToClass(BidTodo, data));
  }
}
