import { Entity, Column, ManyToOne, JoinColumn, OneToOne } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { Expose } from 'class-transformer';
import { DistrictEntity } from './district.entity';
import { UserEntity } from '../../users/entities';

@Entity({ name: 'districts_to_engineers' })
export class DistrictsToEngineersEntity extends BaseEntity {
  @Column({ nullable: false })
  @Expose()
  districtId!: number;

  @ManyToOne(() => DistrictEntity)
  @JoinColumn({
    name: 'districtId',
    referencedColumnName: 'id',
  })
  @Expose()
  district?: DistrictEntity;

  @Column({ nullable: false })
  @Expose()
  engineerId!: number;

  @OneToOne(() => UserEntity)
  @JoinColumn({
    name: 'engineerId',
    referencedColumnName: 'id',
  })
  @Expose()
  engineer?: UserEntity;
}
