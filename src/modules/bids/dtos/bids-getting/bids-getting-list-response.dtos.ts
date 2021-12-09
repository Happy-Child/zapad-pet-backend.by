import { PaginationResponseDTO, ShortUserWithEmailDTO } from '@app/dtos';
import { BID_PRIORITY, BID_STATUS } from '../../constants';
import { Expose, plainToClass, Type } from 'class-transformer';
import { StationEntity } from '@app/entities';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';

class GetListBidsGeneralItemDTO {
  @Expose()
  id!: number;

  @Expose()
  status!: BID_STATUS;

  @Expose()
  priority!: BID_PRIORITY;

  @Expose()
  deadlineAt!: string;

  constructor(
    data: GetListBidsGeneralItemDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    Object.assign(
      this,
      plainToClass(GetListBidsGeneralItemDTO, data, {
        ...serializeOptions,
        excludeExtraneousValues: true,
      }),
    );
  }
}

export class GetListBidsEngineerItemDTO extends GetListBidsGeneralItemDTO {
  constructor(
    data: GetListBidsEngineerItemDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    super(data, serializeOptions);
  }
}

export class GetListBidsDistrictLeaderItemDTO extends GetListBidsGeneralItemDTO {
  @Expose()
  createdAt!: string;

  @Expose()
  startWorkAt!: string;

  @Expose()
  endWorkAt!: string;

  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  engineer!: ShortUserWithEmailDTO | null;

  constructor(
    data: GetListBidsDistrictLeaderItemDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    super(data, serializeOptions);
  }
}

export class GetListBidsStationWorkerItemDTO extends GetListBidsGeneralItemDTO {
  @Expose()
  confirmSuccessAt!: string | null;

  @Expose()
  createdAt!: string;

  constructor(
    data: GetListBidsStationWorkerItemDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    super(data, serializeOptions);
  }
}

export class GetListBidsMasterItemDTO extends GetListBidsDistrictLeaderItemDTO {
  @Expose()
  confirmSuccessAt!: string | null;

  @Type(() => StationEntity)
  @Expose()
  station!: StationEntity;

  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  stationWorker!: ShortUserWithEmailDTO;

  @Type(() => ShortUserWithEmailDTO)
  @Expose()
  districtLeader!: ShortUserWithEmailDTO;

  constructor(
    data: GetListBidsMasterItemDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    super(data, serializeOptions);
  }
}

export class GetListBidsEngineerResponseDTO extends PaginationResponseDTO<GetListBidsEngineerItemDTO> {
  constructor(data: GetListBidsEngineerResponseDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map((item) => new GetListBidsEngineerItemDTO(item));
  }
}

export class GetListBidsDistrictLeaderResponseDTO extends PaginationResponseDTO<GetListBidsDistrictLeaderItemDTO> {
  constructor(data: GetListBidsDistrictLeaderResponseDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map(
      (item) => new GetListBidsDistrictLeaderItemDTO(item),
    );
  }
}

export class GetListBidsStationWorkerResponseDTO extends PaginationResponseDTO<GetListBidsStationWorkerItemDTO> {
  constructor(data: GetListBidsStationWorkerResponseDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map(
      (item) => new GetListBidsStationWorkerItemDTO(item),
    );
  }
}

export class GetListBidsMasterResponseDTO extends PaginationResponseDTO<GetListBidsMasterItemDTO> {
  constructor(data: GetListBidsMasterResponseDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map((item) => new GetListBidsMasterItemDTO(item));
  }
}

export type GetListBidsResponseDTO =
  | GetListBidsEngineerResponseDTO
  | GetListBidsDistrictLeaderResponseDTO
  | GetListBidsStationWorkerResponseDTO
  | GetListBidsMasterResponseDTO;
