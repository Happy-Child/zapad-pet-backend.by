import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { IPasswordRecovery } from '@app/auth/interfaces';

@Entity({ name: 'password_recovery' })
export class PasswordRecoveryEntity
  extends BaseEntity
  implements IPasswordRecovery
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

  @Column({ nullable: false })
  attemptCount!: number;
}
