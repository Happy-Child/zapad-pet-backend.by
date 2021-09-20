import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { IEmailConfirmed } from '@app/auth/interfaces';

@Entity({ name: 'email_confirmed' })
export class EmailConfirmedEntity
  extends BaseEntity
  implements IEmailConfirmed
{
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  token!: string;
}
