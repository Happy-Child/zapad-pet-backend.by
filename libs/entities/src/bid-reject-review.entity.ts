import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { Expose } from 'class-transformer';
import { BidEntity } from '@app/entities/bid.entity';

@Entity({ name: 'bid_reject_review' })
export class BidRejectReviewEntity extends BaseEntity {
  @Column({ nullable: false })
  @Expose()
  userId!: number;

  @Column({ nullable: false })
  @Expose()
  bidId!: number;

  @ManyToOne(() => BidEntity)
  @JoinColumn({
    name: 'bidId',
    referencedColumnName: 'id',
  })
  bid?: BidEntity;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
  })
  @Expose()
  text!: string;
}
