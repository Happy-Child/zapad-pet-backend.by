import { BidDTO, BidTodoDTO } from '../bids-general.dtos';
import { Expose, plainToClass, Transform, Type } from 'class-transformer';
import { ShortUserDTO, StorageFileDTO } from '@app/dtos';
import { NonEmptyArray } from '@app/types';
import {
  DropboxStorageEntity,
  LocalStorageEntity,
  StationEntity,
} from '@app/entities';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { getStorageFile } from '@app/file-storage/helpers/file-storage-general.helpers';
import { ApiProperty } from '@nestjs/swagger';

export class GetBidSingleEngineerResponseDTO extends BidDTO {
  @ApiProperty({ type: StorageFileDTO, nullable: true })
  @Transform(({ value, obj }) =>
    !value
      ? getStorageFile(obj?.finalPhotoLocal, obj?.finalPhotoDropbox)
      : value,
  )
  @Type(() => StorageFileDTO)
  @Expose()
  finalPhoto!: StorageFileDTO | null;

  finalPhotoLocal!: LocalStorageEntity | null;

  finalPhotoDropbox!: DropboxStorageEntity | null;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  startWorkAt!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  endWorkAt!: string | null;

  @ApiProperty({ type: BidTodoDTO, isArray: true })
  @Type(() => BidTodoDTO)
  @Expose()
  todos!: NonEmptyArray<BidTodoDTO>;

  constructor(
    data: Partial<GetBidSingleEngineerResponseDTO>,
    serializeOptions?: ClassTransformOptions,
  ) {
    super(data);

    Object.assign(
      this,
      plainToClass(GetBidSingleEngineerResponseDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class GetBidSingleDistrictLeaderResponseDTO extends GetBidSingleEngineerResponseDTO {
  @ApiProperty({ type: ShortUserDTO, nullable: true })
  @Type(() => ShortUserDTO)
  @Expose()
  rejectedUser!: ShortUserDTO | null;

  @ApiProperty({ type: ShortUserDTO, nullable: true })
  @Type(() => ShortUserDTO)
  @Expose()
  engineer!: ShortUserDTO | null;

  @ApiProperty()
  @Expose()
  createdAt!: string;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  startWorkAt!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  endWorkAt!: string | null;

  constructor(
    data: Partial<GetBidSingleDistrictLeaderResponseDTO>,
    serializeOptions?: ClassTransformOptions,
  ) {
    super(data);

    Object.assign(
      this,
      plainToClass(GetBidSingleDistrictLeaderResponseDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class GetBidStationWorkerResponseDTO extends BidDTO {
  @ApiProperty({ type: ShortUserDTO, nullable: true })
  @Type(() => ShortUserDTO)
  @Expose()
  rejectedUser!: ShortUserDTO | null;

  @ApiProperty({ type: ShortUserDTO, nullable: true })
  @Type(() => ShortUserDTO)
  @Expose()
  confirmedStationWorker!: ShortUserDTO | null;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  confirmSuccessAt!: string | null;

  @ApiProperty()
  @Expose()
  createdAt!: string;

  constructor(
    data: Partial<GetBidStationWorkerResponseDTO>,
    serializeOptions?: ClassTransformOptions,
  ) {
    super(data);

    Object.assign(
      this,
      plainToClass(GetBidStationWorkerResponseDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class GetBidSingleMasterResponseDTO extends GetBidSingleDistrictLeaderResponseDTO {
  @ApiProperty({ type: StationEntity })
  @Type(() => StationEntity)
  @Expose()
  station!: StationEntity;

  @ApiProperty({ type: ShortUserDTO })
  @Type(() => ShortUserDTO)
  @Expose()
  stationWorker!: ShortUserDTO;

  @ApiProperty({ type: ShortUserDTO, nullable: true })
  @Type(() => ShortUserDTO)
  @Expose()
  districtLeader!: ShortUserDTO | null;

  @ApiProperty({ type: ShortUserDTO, nullable: true })
  @Type(() => ShortUserDTO)
  @Expose()
  confirmedStationWorker!: ShortUserDTO | null;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  confirmSuccessAt!: string | null;

  constructor(
    data: Partial<GetBidSingleMasterResponseDTO>,
    serializeOptions?: ClassTransformOptions,
  ) {
    super(data);

    Object.assign(
      this,
      plainToClass(GetBidSingleMasterResponseDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export type TGetBidSingleResponseDTO =
  | GetBidSingleEngineerResponseDTO
  | GetBidSingleDistrictLeaderResponseDTO
  | GetBidStationWorkerResponseDTO
  | GetBidSingleMasterResponseDTO;
