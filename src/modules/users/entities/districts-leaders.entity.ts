import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { Expose } from 'class-transformer';
import { UserEntity } from './user.entity';
import { DistrictEntity } from '../../districts';

@Entity({ name: 'districts_leaders' })
export class DistrictLeaderEntity extends BaseEntity {
  @Column({ nullable: false, unique: true })
  @Expose()
  userId!: number;

  @OneToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({
    name: 'userId',
    referencedColumnName: 'id',
  })
  @Expose()
  user!: UserEntity;

  @Column({ nullable: false, unique: true })
  @Expose()
  districtId!: number;

  @OneToOne(() => DistrictEntity)
  @JoinColumn({
    name: 'districtId',
    referencedColumnName: 'id',
  })
  @Expose()
  district!: DistrictEntity;
}
