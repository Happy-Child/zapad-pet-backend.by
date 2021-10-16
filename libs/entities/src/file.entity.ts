import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { Expose } from 'class-transformer';

@Entity({ name: 'file' })
export class FileEntity extends BaseEntity {
  @Column({ type: 'varchar', length: VARCHAR_DEFAULT_LENGTH, nullable: false })
  @Expose()
  filename!: string;
}
