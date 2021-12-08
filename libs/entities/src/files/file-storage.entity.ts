import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { Expose } from 'class-transformer';

@Entity({ name: 'file_storage' })
export class FileStorageEntity extends BaseEntity {
  @Column({ type: 'int', nullable: true, unique: true })
  @Expose()
  localId!: number | null;

  @Column({ type: 'int', nullable: true, unique: true })
  @Expose()
  dropboxId!: number | null;
}
