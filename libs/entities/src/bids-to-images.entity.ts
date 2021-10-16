import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'bids_to_images' })
export class BidsToImagesEntity extends BaseEntity {
  @Column({ nullable: false })
  @Expose()
  bidId!: number;

  @Column({ nullable: false })
  @Expose()
  imageId!: number;
}
