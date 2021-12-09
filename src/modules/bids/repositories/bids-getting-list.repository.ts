import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { BidEntity } from '@app/entities';
import { GeneralRepository } from '@app/repositories';
import {
  GetListBidsDistrictLeaderResponseDTO,
  GetListBidsEngineerResponseDTO,
  GetListBidsMasterResponseDTO,
  GetListBidsStationWorkerResponseDTO,
  TGetListBidsQueryDTO,
} from '../dtos';
import {
  BIDS_LIST_DEFAULT_SORT_BY,
  BIDS_LIST_DEFAULT_SORT_DURATION,
} from '../constants';
import { ENTITIES_FIELDS } from '@app/constants';

const getFinalSortBy = (type: ENTITIES_FIELDS): string => {
  switch (type) {
    case ENTITIES_FIELDS.PRIORITY:
      return 'b.priority';
    case ENTITIES_FIELDS.DEADLINE:
      return 'b.deadline';
    case ENTITIES_FIELDS.START_WORK_AT:
      return '"b"."startWorkAt"';
    case ENTITIES_FIELDS.END_WORK_AT:
      return '"b"."endWorkAt"';
    case ENTITIES_FIELDS.CONFIRM_SUCCESS_AT:
      return '"b"."confirmSuccessAt"';
    case ENTITIES_FIELDS.STATION_NUMBER:
      return 'st.number';
    default:
      return '"b"."createdAt"';
  }
};

@EntityRepository(BidEntity)
export class BidsGettingListRepository extends GeneralRepository<BidEntity> {
  protected entitySerializer = BidEntity;

  public async getBidsListForEngineer(
    builder: SelectQueryBuilder<BidEntity>,
    data: TGetListBidsQueryDTO,
  ): Promise<GetListBidsEngineerResponseDTO> {
    this.bindGeneralConditions(builder, data);
    this.bindPaginationAndSort(builder, data);

    return new GetListBidsEngineerResponseDTO({
      totalItemsCount: 0,
      items: [],
      take: 0,
      skip: 0,
    });
  }

  public async getBidsListForDistrictLeader(
    builder: SelectQueryBuilder<BidEntity>,
    data: TGetListBidsQueryDTO,
  ): Promise<GetListBidsDistrictLeaderResponseDTO> {
    this.bindGeneralConditions(builder, data);
    this.bindPaginationAndSort(builder, data);

    return new GetListBidsDistrictLeaderResponseDTO({
      totalItemsCount: 0,
      items: [],
      take: 0,
      skip: 0,
    });
  }

  public async getBidsListForStationWorker(
    builder: SelectQueryBuilder<BidEntity>,
    data: TGetListBidsQueryDTO,
  ): Promise<GetListBidsStationWorkerResponseDTO> {
    this.bindGeneralConditions(builder, data);
    this.bindPaginationAndSort(builder, data);

    return new GetListBidsStationWorkerResponseDTO({
      totalItemsCount: 0,
      items: [],
      take: 0,
      skip: 0,
    });
  }

  public async getBidsListForMaster(
    builder: SelectQueryBuilder<BidEntity>,
    data: TGetListBidsQueryDTO,
  ): Promise<GetListBidsMasterResponseDTO> {
    this.bindGeneralConditions(builder, data);
    this.bindPaginationAndSort(builder, data);

    return new GetListBidsMasterResponseDTO({
      totalItemsCount: 0,
      items: [],
      take: 0,
      skip: 0,
    });
  }

  private bindGeneralConditions(
    builder: SelectQueryBuilder<BidEntity>,
    {
      status,
      priority,
      dateRangeTo,
      dateRangeType,
      dateRangeFrom,
    }: Pick<
      TGetListBidsQueryDTO,
      'status' | 'priority' | 'dateRangeTo' | 'dateRangeFrom' | 'dateRangeType'
    >,
  ): void {
    if (dateRangeType && (dateRangeTo || dateRangeFrom)) {
      if (dateRangeFrom) {
        builder.andWhere(`"b"."${dateRangeType}" >= ${dateRangeFrom}`);
      }
      if (dateRangeTo) {
        builder.andWhere(`"b"."${dateRangeType}" <= ${dateRangeTo}`);
      }
    }

    if (status) {
      builder.andWhere('b.status IN (:...status)', {
        status,
      });
    }

    if (priority) {
      builder.where('b.priority IN (:...priority)', {
        priority,
      });
    }
  }

  private bindPaginationAndSort(
    builder: SelectQueryBuilder<BidEntity>,
    {
      skip,
      take,
      sortBy,
      sortDuration,
    }: Pick<TGetListBidsQueryDTO, 'skip' | 'take' | 'sortDuration' | 'sortBy'>,
  ): void {
    const totalSkip = skip || 0;
    const totalSortBy = getFinalSortBy(sortBy || BIDS_LIST_DEFAULT_SORT_BY);
    const totalSortDuration = sortDuration || BIDS_LIST_DEFAULT_SORT_DURATION;

    builder
      .orderBy(totalSortBy, totalSortDuration)
      .offset(totalSkip)
      .limit(take);
  }
}
