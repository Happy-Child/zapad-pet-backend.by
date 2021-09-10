import { Entity, Column, ManyToOne, OneToOne, JoinColumn } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { plainToClass } from 'class-transformer';
import { Region } from '@app/entities/region.entity';
import { User } from '@app/entities/user.entity';

@Entity({ name: 'district' })
export class District extends BaseEntity {
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

  @Column({ nullable: false })
  regionId: number;

  @ManyToOne(() => Region)
  @JoinColumn({
    name: 'regionId',
    referencedColumnName: 'id',
  })
  region: Region;

  @Column({ nullable: true })
  districtLeaderId: number;

  @OneToOne(() => User)
  @JoinColumn({
    name: 'districtLeaderId',
    referencedColumnName: 'id',
  })
  districtLeader: User;

  constructor(data: Partial<District>) {
    super();
    Object.assign(this, plainToClass(District, data));
  }
}
