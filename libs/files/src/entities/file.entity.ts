import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { plainToClass } from 'class-transformer';

@Entity({ name: 'file' })
export class File extends BaseEntity {
  @Column({ type: 'varchar', length: VARCHAR_DEFAULT_LENGTH, nullable: false })
  filename!: string;

  constructor(data: Partial<File>) {
    super();
    Object.assign(this, plainToClass(File, data));
  }
}
