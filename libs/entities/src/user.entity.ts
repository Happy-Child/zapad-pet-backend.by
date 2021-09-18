import { Entity, Column } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { USER_ROLES, VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { Exclude, Expose, plainToClass } from 'class-transformer';

@Entity({ name: 'user' })
export class User extends BaseEntity {
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
  @Exclude()
  emailConfirmed!: boolean;

  @Column()
  @Exclude()
  password!: string;

  constructor(data: Partial<User>) {
    super();
    Object.assign(
      this,
      plainToClass(User, data, { excludeExtraneousValues: true }),
    );
  }
}
