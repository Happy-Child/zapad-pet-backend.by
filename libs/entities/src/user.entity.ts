import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { USER_ROLES, VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { plainToClass } from 'class-transformer';

@Entity({ name: 'user' })
export class User extends BaseEntity {
  @Column({ type: 'varchar', length: VARCHAR_DEFAULT_LENGTH, nullable: false })
  name: string;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  email: string;

  @Column({
    type: 'enum',
    enum: USER_ROLES,
    nullable: false,
  })
  role: USER_ROLES;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  emailConfirmed: boolean;

  constructor(data: Partial<User>) {
    super();
    Object.assign(this, plainToClass(User, data));
  }
}
