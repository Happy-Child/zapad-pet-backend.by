import { Entity, Column } from 'typeorm';
import { BaseEntity } from './base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { USER_EXPOSE_GROUPS } from '../../../src/modules/users/constants';
import { Expose } from 'class-transformer';
import { USER_ROLES } from '@app/constants';
import { ApiProperty } from '@nestjs/swagger';

@Entity({ name: 'user' })
export class UserEntity extends BaseEntity {
  @ApiProperty()
  @Expose()
  @Column({ type: 'varchar', length: VARCHAR_DEFAULT_LENGTH, nullable: false })
  name!: string;

  @ApiProperty()
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

  @ApiProperty()
  @Column({
    type: 'boolean',
    nullable: false,
    default: false,
  })
  @Expose()
  emailConfirmed!: boolean;

  @Column()
  @Expose({ groups: [USER_EXPOSE_GROUPS.PASSWORD] })
  password?: string;
}
