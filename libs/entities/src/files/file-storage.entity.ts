import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';

@Entity({ name: 'file_storage' })
export class FileStorageEntity extends BaseEntity {
  @Column({ type: 'int', nullable: true, unique: true })
  localId!: number | null;

  @Column({ type: 'int', nullable: true, unique: true })
  dropboxId!: number | null;
}
