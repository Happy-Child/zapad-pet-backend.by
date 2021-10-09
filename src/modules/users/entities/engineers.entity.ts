import { Entity, Column, OneToOne, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { Expose } from 'class-transformer';
import { UserEntity } from './user.entity';
import { DistrictEntity } from '../../districts';

@Entity({ name: 'engineers' })
export class EngineerEntity extends BaseEntity {
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

  @Column({ nullable: false })
  @Expose()
  districtId!: number;

  @ManyToOne(() => DistrictEntity, (district) => district.engineers)
  @JoinColumn({
    name: 'districtId',
    referencedColumnName: 'id',
  })
  @Expose()
  district!: DistrictEntity;
}
