import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from './base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { Expose } from 'class-transformer';
import { StationWorkerEntity } from '@app/entities/stations-workers.entity';
import { StationEntity } from '@app/entities/station.entity';
import { IsString, Length } from 'class-validator';
import { CLIENT_NAME_LENGTH } from '../../../src/modules/clients/constants';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'client' })
export class ClientEntity extends BaseEntity {
  @ApiProperty()
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  @IsString()
  @Length(CLIENT_NAME_LENGTH.MIN, CLIENT_NAME_LENGTH.MAX)
  @Expose()
  name!: string;

  @OneToMany(() => StationWorkerEntity, (worker) => worker.client)
  stationsWorkers!: StationWorkerEntity[];

  @OneToMany(() => StationEntity, (station) => station.client)
  stations!: StationEntity[];
}
