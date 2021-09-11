import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { plainToClass } from 'class-transformer';

@Entity({ name: 'region' })
export class Region extends BaseEntity {
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  slug: string;

  constructor(data: Partial<Region>) {
    super();
    Object.assign(this, plainToClass(Region, data));
  }
}
