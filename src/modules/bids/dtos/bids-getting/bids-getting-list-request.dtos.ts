import { PaginationRequestDTO } from '@app/dtos';
import { IsInt } from 'class-validator';
import { Type } from 'class-transformer';

export class GetListBidsGeneralQueryDTO extends PaginationRequestDTO {
  //
}

export class GetListBidsEngineerQueryDTO extends GetListBidsGeneralQueryDTO {
  //
}

export class GetListBidsDistrictLeaderQueryDTO extends GetListBidsGeneralQueryDTO {
  //
}

export class GetListBidsStationWorkerQueryDTO extends GetListBidsGeneralQueryDTO {
  //
}

export class GetListBidsMasterQueryDTO extends GetListBidsGeneralQueryDTO {
  @IsInt()
  @Type(() => Number)
  test!: number;
}

export type TGetListBidsQueryDTO =
  | GetListBidsEngineerQueryDTO
  | GetListBidsDistrictLeaderQueryDTO
  | GetListBidsMasterQueryDTO
  | GetListBidsStationWorkerQueryDTO;
