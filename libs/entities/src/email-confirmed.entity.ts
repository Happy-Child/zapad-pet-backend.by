import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { plainToClass } from 'class-transformer';
import { EMAIL_TOKEN_LENGTH } from '@app/constants';

@Entity({ name: 'email_confirmed' })
export class EmailConfirmed extends BaseEntity {
  @Column({ nullable: false })
  userId: number;

  @Column({
    type: 'varchar',
    length: EMAIL_TOKEN_LENGTH,
    nullable: false,
    unique: true,
  })
  token: string;

  constructor(data: Partial<EmailConfirmed>) {
    super();
    Object.assign(this, plainToClass(EmailConfirmed, data));
  }
}
