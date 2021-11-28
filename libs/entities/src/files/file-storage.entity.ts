import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';

@Entity({ name: 'file_storage' })
export class FileStorageEntity extends BaseEntity {
  @Column({ type: 'varchar', nullable: true, unique: true })
  localId!: string | null;

  @Column({ type: 'varchar', nullable: true, unique: true })
  dropboxId!: string | null;
}
