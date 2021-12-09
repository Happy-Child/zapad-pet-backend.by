import { Injectable } from '@nestjs/common';
import { TJwtPayloadDTO } from '../../../auth/types';
import { GetListBidsResponseDTO, TGetListBidsQueryDTO } from '../../dtos';
import { USER_ROLES } from '@app/constants';
import { BidsGettingListRepository } from '../../repositories/bids-getting-list.repository';

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
          query,
        );
      case USER_ROLES.DISTRICT_LEADER:
        return this.bidsGettingListRepository.getBidsListForDistrictLeader(
          builder,
          query,
        );
      case USER_ROLES.ENGINEER:
        return this.bidsGettingListRepository.getBidsListForEngineer(
          builder,
          query,
        );
      default:
        return this.bidsGettingListRepository.getBidsListForMaster(
          builder,
          query,
        );
    }
  }
}
