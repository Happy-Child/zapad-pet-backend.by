import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';

@Entity({ name: 'o2m_bid_images' })
export class O2MBidToImages extends BaseEntity {
  @Column({ nullable: false })
  bidId: number;

  @Column({ nullable: false })
  imageId: number;
}
