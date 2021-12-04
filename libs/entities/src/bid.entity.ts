import {
  Entity,
  Column,
  ManyToOne,
  JoinColumn,
  OneToOne,
  OneToMany,
} from 'typeorm';
import { Expose } from 'class-transformer';
import { VARCHAR_DEFAULT_LENGTH } from '@app/constants';
import { BID_PRIORITY, BID_STATUS } from '../../../src/modules/bids/constants';
import { BidTodoEntity } from './bid-todo.entity';
import { BaseEntity } from './base.entity';
import { StationEntity } from '@app/entities/station.entity';
import { EngineerEntity } from '@app/entities/engineers.entity';
import { UserEntity } from '@app/entities/user.entity';
import { StationWorkerEntity } from '@app/entities/stations-workers.entity';
import { FileStorageEntity } from '@app/entities/files/file-storage.entity';
import { BidRejectReviewEntity } from '@app/entities/bid-reject-review.entity';

@Entity({ name: 'bid' })
export class BidEntity extends BaseEntity {
  @Column({
    type: 'enum',
    enum: BID_STATUS,
    nullable: false,
    default: BID_STATUS.PENDING_ASSIGNMENT_TO_ENGINEER,
  })
  @Expose()
  status!: BID_STATUS;

  @Column({
    type: 'enum',
    enum: BID_PRIORITY,
    nullable: false,
    default: BID_PRIORITY.MEDIUM,
  })
  @Expose()
  priority!: BID_PRIORITY;

  @Column({
    type: 'varchar',
    length: VARCHAR_DEFAULT_LENGTH,
    nullable: true,
  })
  @Expose()
  description!: string | null;

  @Column({ nullable: false })
  @Expose()
  stationId!: number;

  @ManyToOne(() => StationEntity, (station) => station.bids)
  @JoinColumn({
    name: 'stationId',
    referencedColumnName: 'id',
  })
  @Expose()
  station?: StationEntity;

  @Column({ nullable: true })
  @Expose()
  engineerId!: number | null;

  @ManyToOne(() => EngineerEntity)
  @JoinColumn({
    name: 'engineerId',
    referencedColumnName: 'userId',
  })
  @Expose()
  engineer!: EngineerEntity | null;

  @Column({ nullable: true })
  @Expose()
  rejectedUserId!: number | null;

  @ManyToOne(() => UserEntity)
  @JoinColumn({
    name: 'rejectedUserId',
    referencedColumnName: 'id',
  })
  @Expose()
  rejectedUser!: UserEntity | null;

  @Column({ nullable: true })
  @Expose()
  confirmedStationWorkerId!: number | null;

  @ManyToOne(() => StationWorkerEntity)
  @JoinColumn({
    name: 'confirmedStationWorkerId',
    referencedColumnName: 'userId',
  })
  @Expose()
  confirmedStationWorker!: StationWorkerEntity | null;

  @Column({ nullable: true })
  @Expose()
  imageFileId!: number | null;

  @OneToOne(() => FileStorageEntity)
  @JoinColumn({
    name: 'imageFileId',
    referencedColumnName: 'id',
  })
  @Expose()
  imageFile!: FileStorageEntity | null;

  @Column({ nullable: true })
  finalPhotoId!: number | null;

  @OneToOne(() => FileStorageEntity)
  @JoinColumn({
    name: 'finalPhotoId',
    referencedColumnName: 'id',
  })
  @Expose()
  finalPhoto!: FileStorageEntity | null;

  @OneToMany(() => BidRejectReviewEntity, (data) => data.bid)
  @Expose()
  lastRejectReview!: null;

  @OneToMany(() => BidTodoEntity, (todo) => todo.bid)
  @Expose()
  todos!: BidTodoEntity[];

  @Column({ type: 'timestamptz', nullable: false })
  @Expose()
  deadlineAt!: string;

  @Column({ type: 'timestamptz', nullable: true })
  @Expose()
  startWorkAt!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  @Expose()
  endWorkAt!: string | null;

  @Column({ type: 'timestamptz', nullable: true })
  @Expose()
  confirmSuccessAt!: string | null;
}
