import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { plainToClass } from 'class-transformer';

@Entity({ name: 'client' })
export class Client extends BaseEntity {
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  name: string;

  constructor(data: Partial<Client>) {
    super();
    Object.assign(this, plainToClass(Client, data));
  }
}
