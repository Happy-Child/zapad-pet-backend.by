import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { Expose } from 'class-transformer';
import { EngineerEntity } from '@app/entities/engineers.entity';

@Entity({ name: 'district' })
export class DistrictEntity extends BaseEntity {
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

  @Column({ nullable: false })
  @Expose()
  regionSlug!: string;

  @OneToMany(() => EngineerEntity, (engineer) => engineer.district)
  engineers!: EngineerEntity[];
}
