import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'o2m_district_to_engineers' })
export class O2MDistrictToEngineers extends BaseEntity {
  @Column({ nullable: false })
  @Expose()
  districtId!: number;

  @Column({ nullable: false })
  @Expose()
  engineerId!: number;
}
