import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { plainToClass } from 'class-transformer';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';

@Entity({ name: 'email_confirmed' })
export class EmailConfirmed extends BaseEntity {
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  token: string;

  constructor(data: Partial<EmailConfirmed>) {
    super();
    Object.assign(this, plainToClass(EmailConfirmed, data));
  }
}
