import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Exclude, Expose } from 'class-transformer';

@Expose()
export class BaseEntity {
  @Expose()
  @PrimaryGeneratedColumn()
  id!: number;

  @Exclude()
  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @Exclude()
  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;
}
