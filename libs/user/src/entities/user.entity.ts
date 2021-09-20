import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { USER_ROLES } from '@app/user/constants';
import { IUser } from '@app/user/interfaces';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity implements IUser {
  @Column({ type: 'varchar', length: VARCHAR_DEFAULT_LENGTH, nullable: false })
  name!: string;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  email!: string;

  @Column({
    type: 'enum',
    enum: USER_ROLES,
    nullable: false,
  })
  role!: USER_ROLES;

  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  emailConfirmed!: boolean;

  @Column()
  password?: string;
}
