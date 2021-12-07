import { Entity, Column, ManyToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { Expose } from 'class-transformer';
import { BidEntity } from '@app/entities/bid.entity';
import { BID_REVIEW_TYPE } from '../../../src/modules/bids/constants';
import { UserEntity } from '@app/entities/user.entity';

@Entity({ name: 'bid_reject_review' })
export class BidRejectReviewEntity extends BaseEntity {
  @Column({ nullable: false })
  @Expose()
  userId!: number;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  @Expose()
  user!: UserEntity;

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
    type: 'enum',
    enum: BID_REVIEW_TYPE,
    nullable: false,
  })
  @Expose()
  type!: BID_REVIEW_TYPE;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
  })
  @Expose()
  text!: string;
}
