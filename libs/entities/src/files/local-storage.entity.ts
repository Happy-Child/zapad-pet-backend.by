import { Column, Entity } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';

@Entity({ name: 'local_storage' })
export class LocalStorageEntity extends BaseEntity {
  @Column()
  filename!: string;
}
