import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { plainToClass } from 'class-transformer';
import { Region } from '../../regions';
import { User } from '@app/entities';

@Entity({ name: 'district' })
export class District extends BaseEntity {
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  name!: string;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  slug!: string;

  @Column({ nullable: false })
  regionSlug!: string;

  @ManyToOne(() => Region)
  @JoinColumn({
    name: 'regionSlug',
    referencedColumnName: 'slug',
  })
  region!: Region;

  @Column({ nullable: true })
  districtLeaderId!: number | null;

  @OneToOne(() => User)
  @JoinColumn({
    name: 'districtLeaderId',
    referencedColumnName: 'id',
  })
  districtLeader!: User | null;

  constructor(data: Partial<District>) {
    super();
    Object.assign(this, plainToClass(District, data));
  }
}
