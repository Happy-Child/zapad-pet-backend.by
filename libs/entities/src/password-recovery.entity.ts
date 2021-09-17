import { Entity, Column, UpdateDateColumn } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { Expose, plainToClass } from 'class-transformer';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';

@Entity({ name: 'password_recovery' })
export class PasswordRecovery extends BaseEntity {
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  @Expose()
  email!: string;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  @Expose()
  token!: string;

  @Column({ nullable: false })
  @Expose()
  attemptCount!: number;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Expose()
  updatedAt!: Date;

  constructor(data: Partial<PasswordRecovery>) {
    super();
    Object.assign(
      this,
      plainToClass(PasswordRecovery, data, { excludeExtraneousValues: true }),
    );
  }
}
