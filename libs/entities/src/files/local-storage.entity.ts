import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'local_storage' })
export class LocalStorageEntity extends BaseEntity {
  @Expose()
  @Column()
  filename!: string;
}
