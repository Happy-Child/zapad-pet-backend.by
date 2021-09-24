import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { USER_EXPOSE_PASSWORD_GROUPS, USER_ROLES } from '../constants';
import { Expose } from 'class-transformer';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @Column({ type: 'varchar', length: VARCHAR_DEFAULT_LENGTH, nullable: false })
  @Expose()
  name!: string;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  @Expose()
  email!: string;

  @Column({
    type: 'enum',
    enum: USER_ROLES,
    nullable: false,
  })
  @Expose()
  role!: USER_ROLES;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  @Expose()
  emailConfirmed!: boolean;

  @Column()
  @Expose({ groups: USER_EXPOSE_PASSWORD_GROUPS })
  password?: string;
}
