import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  @Expose()
  id!: number;

  @CreateDateColumn({ type: 'timestamptz' })
  @Expose()
  createdAt!: string;

  @UpdateDateColumn({ type: 'timestamptz' })
  @Expose()
  updatedAt!: string;
}
