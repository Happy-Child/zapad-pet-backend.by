import {
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class BaseEntity {
  @ApiProperty({ type: Number })
  @PrimaryGeneratedColumn()
  @Expose()
  id!: number;

  @ApiProperty({ type: String })
  @CreateDateColumn({ type: 'timestamptz' })
  @Expose()
  createdAt!: string;

  @ApiProperty({ type: String })
  @UpdateDateColumn({ type: 'timestamptz' })
  @Expose()
  updatedAt!: string;
}
