import { PaginationResponseDTO, ShortUserDTO } from '@app/dtos';
import { BID_PRIORITY, BID_STATUS } from '../../constants';
import { Expose, plainToClass, Type } from 'class-transformer';
import { StationEntity } from '@app/entities';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { ApiProperty } from '@nestjs/swagger';

export class GetListBidsGeneralItemDTO {
  @ApiProperty({ type: Number })
  @Expose()
  id!: number;

  @ApiProperty({ enum: BID_STATUS })
  @Expose()
  status!: BID_STATUS;

  @ApiProperty({ enum: BID_PRIORITY })
  @Expose()
  priority!: BID_PRIORITY;

  @ApiProperty({ type: String })
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
  @ApiProperty({ type: String })
  @Expose()
  createdAt!: string;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  startWorkAt!: string | null;

  @ApiProperty({ type: String, nullable: true })
  @Expose()
  endWorkAt!: string | null;

  @ApiProperty({ type: ShortUserDTO, nullable: true })
  @Type(() => ShortUserDTO)
  @Expose()
  engineer!: ShortUserDTO | null;

  constructor(
    data: GetListBidsDistrictLeaderItemDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    super(data, serializeOptions);
  }
}

export class GetListBidsStationWorkerItemDTO extends GetListBidsGeneralItemDTO {
  @ApiProperty({ type: String, nullable: true })
  @Expose()
  confirmSuccessAt!: string | null;

  @ApiProperty({ type: String, nullable: true })
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
  @ApiProperty({ type: String, nullable: true })
  @Expose()
  confirmSuccessAt!: string | null;

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

  constructor(
    data: GetListBidsMasterItemDTO,
    serializeOptions?: ClassTransformOptions,
  ) {
    super(data, serializeOptions);
  }
}

export class GetListBidsEngineerResponseDTO extends PaginationResponseDTO<GetListBidsEngineerItemDTO> {
  @ApiProperty({
    type: GetListBidsEngineerItemDTO,
    isArray: true,
  })
  @Expose()
  items!: GetListBidsEngineerItemDTO[];

  constructor(data: GetListBidsEngineerResponseDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map((item) => new GetListBidsEngineerItemDTO(item));
  }
}

export class GetListBidsDistrictLeaderResponseDTO extends PaginationResponseDTO<GetListBidsDistrictLeaderItemDTO> {
  @ApiProperty({
    type: GetListBidsDistrictLeaderItemDTO,
    isArray: true,
  })
  @Expose()
  items!: GetListBidsDistrictLeaderItemDTO[];

  constructor(data: GetListBidsDistrictLeaderResponseDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map(
      (item) => new GetListBidsDistrictLeaderItemDTO(item),
    );
  }
}

export class GetListBidsStationWorkerResponseDTO extends PaginationResponseDTO<GetListBidsStationWorkerItemDTO> {
  @ApiProperty({
    type: GetListBidsStationWorkerItemDTO,
    isArray: true,
  })
  @Expose()
  items!: GetListBidsStationWorkerItemDTO[];

  constructor(data: GetListBidsStationWorkerResponseDTO) {
    super();
    Object.assign(this, data);
    this.items = data.items.map(
      (item) => new GetListBidsStationWorkerItemDTO(item),
    );
  }
}

export class GetListBidsMasterResponseDTO extends PaginationResponseDTO<GetListBidsMasterItemDTO> {
  @ApiProperty({
    type: GetListBidsMasterItemDTO,
    isArray: true,
  })
  @Expose()
  items!: GetListBidsMasterItemDTO[];

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
