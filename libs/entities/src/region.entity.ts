import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { Expose } from 'class-transformer';

@Entity({ name: 'region' })
export class RegionEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  @Expose()
  name!: string;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  @Expose()
  slug!: string;
}
