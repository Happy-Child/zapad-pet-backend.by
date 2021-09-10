import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';

@Entity({ name: 'o2m_district_to_engineers' })
export class O2MDistrictToEngineers extends BaseEntity {
  @Column({ nullable: false })
  districtId: number;

  @Column({ nullable: false })
  engineerId: number;
}
