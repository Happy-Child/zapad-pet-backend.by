import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { plainToClass } from 'class-transformer';
import { PASSWORD_RECOVERY_TOKEN_LENGTH } from '@app/constants';

@Entity({ name: 'password_recovery' })
export class PasswordRecovery extends BaseEntity {
  @Column({ nullable: false })
  userId: number;

  @Column({
    type: 'varchar',
    length: PASSWORD_RECOVERY_TOKEN_LENGTH,
    nullable: false,
    unique: true,
  })
  token: string;

  constructor(data: Partial<PasswordRecovery>) {
    super();
    Object.assign(this, plainToClass(PasswordRecovery, data));
  }
}
