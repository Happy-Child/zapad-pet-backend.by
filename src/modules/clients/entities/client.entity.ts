import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { Expose } from 'class-transformer';
import { StationWorkerEntity } from '../../users/entities';

@Entity({ name: 'client' })
export class ClientEntity extends BaseEntity {
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  @Expose()
  name!: string;

  @OneToMany(() => StationWorkerEntity, (worker) => worker.client)
  stationsWorkers!: StationWorkerEntity[];
}
