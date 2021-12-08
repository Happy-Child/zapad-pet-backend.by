import { BidDTO, BidTodoDTO } from '../bids-general.dtos';
import { Expose, plainToClass, Transform, Type } from 'class-transformer';
import { ShortUserWithEmailDTO, StorageFileDTO } from '@app/dtos';
import { NonEmptyArray } from '@app/types';
import {
  DropboxStorageEntity,
  LocalStorageEntity,
  StationEntity,
} from '@app/entities';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { getStorageFile } from '@app/file-storage/helpers/file-storage-general.helpers';

export class GetBidSingleEngineerResponseDTO extends BidDTO {
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
  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  rejectedUser!: ShortUserWithEmailDTO | null;

  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  engineer!: ShortUserWithEmailDTO | null;

  @Expose()
  createdAt!: string;

  @Expose()
  startWorkAt!: string | null;

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
  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  rejectedUser!: ShortUserWithEmailDTO | null;

  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  confirmedStationWorker!: ShortUserWithEmailDTO | null;

  @Expose()
  confirmSuccessAt!: string | null;

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
  @Type(() => StationEntity)
  @Expose()
  station!: StationEntity;

  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  stationWorker!: ShortUserWithEmailDTO;

  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  districtLeader!: ShortUserWithEmailDTO;

  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  confirmedStationWorker!: ShortUserWithEmailDTO | null;

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
