import { Expose, plainToClass, Transform, Type } from 'class-transformer';
import { BID_PRIORITY, BID_STATUS, BID_TODO_STATUS } from '../constants';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { DropboxStorageEntity, LocalStorageEntity } from '@app/entities';
import { StorageFileDTO } from '@app/dtos';
import { getStorageFile } from '@app/file-storage/helpers/file-storage-general.helpers';
import { ApiProperty } from '@nestjs/swagger';

export class BidsCountByStatusesDTO {
  @ApiProperty({ type: Number, example: 0 })
  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.EDITING]!: number;

  @ApiProperty({ type: Number, example: 0 })
  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.PENDING_ASSIGNMENT_TO_ENGINEER]!: number;

  @ApiProperty({ type: Number, example: 0 })
  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.PENDING_START_WORK_FROM_ENGINEER]!: number;

  @ApiProperty({ type: Number, example: 0 })
  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.IN_WORK]!: number;

  @ApiProperty({ type: Number, example: 0 })
  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.PENDING_REVIEW_FROM_DISTRICT_LEADER]!: number;

  @ApiProperty({ type: Number, example: 0 })
  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.PENDING_REVIEW_FROM_STATION_WORKER]!: number;

  @ApiProperty({ type: Number, example: 0 })
  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.FAIL_REVIEW_FROM_DISTRICT_LEADER]!: number;

  @ApiProperty({ type: Number, example: 0 })
  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.FAIL_REVIEW_FROM_STATION_WORKER]!: number;

  @ApiProperty({ type: Number, example: 0 })
  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.COMPLETED]!: number;

  @ApiProperty({ type: Number, example: 0 })
  @Expose()
  @Transform(({ value }) => value || 0)
  [BID_STATUS.CANCEL]!: number;
}

export class BidDTO {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty({ enum: BID_STATUS })
  @Expose()
  status!: BID_STATUS;

  @ApiProperty({ enum: BID_PRIORITY })
  @Expose()
  priority!: BID_PRIORITY;

  @ApiProperty({ type: String, nullable: true })
  @ApiProperty()
  @Expose()
  description!: string | null;

  @ApiProperty()
  @Expose()
  deadlineAt!: string;

  @ApiProperty({ type: StorageFileDTO, nullable: true })
  @Transform(({ value, obj }) =>
    !value ? getStorageFile(obj?.imageLocal, obj?.imageDropbox) : value,
  )
  @Type(() => StorageFileDTO)
  @Expose()
  image!: StorageFileDTO | null;

  imageLocal!: LocalStorageEntity | null;

  imageDropbox!: DropboxStorageEntity | null;

  constructor(data: Partial<BidDTO>, serializeOptions?: ClassTransformOptions) {
    Object.assign(
      this,
      plainToClass(BidDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class BidTodoDTO {
  @ApiProperty()
  @Expose()
  id!: number;

  @ApiProperty()
  @Expose()
  text!: string;

  @ApiProperty({ enum: BID_TODO_STATUS })
  @Expose()
  status!: BID_TODO_STATUS;
}
