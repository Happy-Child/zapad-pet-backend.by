import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'o2m_bid_images' })
export class O2MBidToImages extends BaseEntity {
  @Column({ nullable: false })
  @Expose()
  bidId!: number;

  @Column({ nullable: false })
  @Expose()
  imageId!: number;
}
