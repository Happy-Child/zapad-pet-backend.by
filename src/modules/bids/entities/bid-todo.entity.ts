import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { Expose } from 'class-transformer';
import { BID_TODO_MAX_LENGTH, BID_TODO_STATUS } from '../constants';
import { BidEntity } from './bid.entity';

@Entity({ name: 'bid_todo' })
export class BidTodoEntity extends BaseEntity {
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

  @ManyToOne(() => BidEntity)
  @JoinColumn({
    name: 'bidId',
    referencedColumnName: 'id',
  })
  @Expose()
  bid?: BidEntity;
}
