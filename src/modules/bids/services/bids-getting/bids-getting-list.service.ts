import { Injectable } from '@nestjs/common';
import { TJwtPayloadDTO } from '../../../auth/types';
import {
  GetListBidsDistrictLeaderQueryDTO,
  GetListBidsEngineerQueryDTO,
  GetListBidsMasterQueryDTO,
  GetListBidsResponseDTO,
  GetListBidsStationWorkerQueryDTO,
  TGetListBidsQueryDTO,
} from '../../dtos';
import { USER_ROLES } from '@app/constants';
import { BidsGettingListRepository } from '../../repositories';

@Injectable()
export class BidsGettingListService {
  constructor(
    private readonly bidsGettingListRepository: BidsGettingListRepository,
  ) {}

  public async getListByPagination(
    query: TGetListBidsQueryDTO,
    user: TJwtPayloadDTO,
  ): Promise<GetListBidsResponseDTO> {
    const builder = this.bidsGettingListRepository.createQueryBuilder('b');

    switch (user.role) {
      case USER_ROLES.STATION_WORKER:
        return this.bidsGettingListRepository.getBidsListForStationWorker(
          builder,
          query as GetListBidsStationWorkerQueryDTO,
        );
      case USER_ROLES.DISTRICT_LEADER:
        return this.bidsGettingListRepository.getBidsListForDistrictLeader(
          builder,
          query as GetListBidsDistrictLeaderQueryDTO,
        );
      case USER_ROLES.ENGINEER:
        return this.bidsGettingListRepository.getBidsListForEngineer(
          builder,
          query as GetListBidsEngineerQueryDTO,
        );
      default:
        return this.bidsGettingListRepository.getBidsListForMaster(
          builder,
          query as GetListBidsMasterQueryDTO,
        );
    }
  }
}
