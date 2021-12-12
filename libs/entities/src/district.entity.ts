import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { Expose } from 'class-transformer';
import { EngineerEntity } from '@app/entities/engineers.entity';
import { StationEntity } from '@app/entities/station.entity';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'district' })
export class DistrictEntity extends BaseEntity {
  @ApiProperty()
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  @Expose()
  name!: string;

  @ApiProperty()
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  @Expose()
  slug!: string;

  @ApiProperty()
  @Column({ nullable: false })
  @Expose()
  regionSlug!: string;

  @OneToMany(() => EngineerEntity, (engineer) => engineer.district)
  @Expose()
  engineers!: EngineerEntity[];

  @OneToMany(() => StationEntity, (station) => station.district)
  @Expose()
  stations!: StationEntity[];
}
