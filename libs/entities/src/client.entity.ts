import { Entity, Column, OneToMany } from 'typeorm';
import { BaseEntity } from '@app/entities/base.entity';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { plainToClass } from 'class-transformer';
import { Station } from '@app/entities/station.entity';

@Entity({ name: 'client' })
export class Client extends BaseEntity {
  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: false,
    unique: true,
  })
  name!: string;

  @OneToMany(() => Station, (station) => station.client)
  stations!: Station[];

  constructor(data: Partial<Client>) {
    super();
    Object.assign(this, plainToClass(Client, data));
  }
}
