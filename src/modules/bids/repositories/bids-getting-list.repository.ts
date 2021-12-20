import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import {
  BidEntity,
  ClientEntity,
  DistrictEntity,
  DistrictLeaderEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import { GeneralRepository } from '@app/repositories';
import {
  GetListBidsDistrictLeaderItemDTO,
  GetListBidsDistrictLeaderQueryDTO,
  GetListBidsDistrictLeaderResponseDTO,
  GetListBidsEngineerItemDTO,
  GetListBidsEngineerQueryDTO,
  GetListBidsEngineerResponseDTO,
  GetListBidsMasterItemDTO,
  GetListBidsMasterQueryDTO,
  GetListBidsMasterResponseDTO,
  GetListBidsStationWorkerItemDTO,
  GetListBidsStationWorkerQueryDTO,
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
    data: GetListBidsEngineerQueryDTO,
  ): Promise<GetListBidsEngineerResponseDTO> {
    this.bindGeneralConditions(builder, data);
    this.bindPaginationAndSort(builder, data);

    const [items, totalItemsCount] =
      (await builder.getManyAndCount()) as unknown as [
        GetListBidsEngineerItemDTO[],
        number,
      ];

    return new GetListBidsEngineerResponseDTO({
      totalItemsCount,
      items,
      take: data.take,
      skip: data.skip || 0,
    });
  }

  public async getBidsListForDistrictLeader(
    builder: SelectQueryBuilder<BidEntity>,
    data: GetListBidsDistrictLeaderQueryDTO,
  ): Promise<GetListBidsDistrictLeaderResponseDTO> {
    this.mapBidsListForDistrictLeader(builder);
    this.bindGeneralConditions(builder, data);
    this.bindDistrictLeaderFilters(builder, data);
    this.bindPaginationAndSort(builder, data);

    const [items, totalItemsCount] =
      (await builder.getManyAndCount()) as unknown as [
        GetListBidsDistrictLeaderItemDTO[],
        number,
      ];

    return new GetListBidsDistrictLeaderResponseDTO({
      totalItemsCount,
      items,
      take: data.take,
      skip: data.skip || 0,
    });
  }

  private mapBidsListForDistrictLeader(
    builder: SelectQueryBuilder<BidEntity>,
  ): void {
    builder.leftJoinAndMapOne(
      'b.engineer',
      UserEntity,
      'u1',
      'u1.id = "b"."engineerId"',
    );
  }

  private bindDistrictLeaderFilters(
    builder: SelectQueryBuilder<BidEntity>,
    data: { engineersIds?: number[] },
  ): void {
    if (data.engineersIds) {
      builder.andWhere('"b"."engineerId" IN (:...ids)', {
        ids: data.engineersIds,
      });
    }
  }

  public async getBidsListForStationWorker(
    builder: SelectQueryBuilder<BidEntity>,
    data: GetListBidsStationWorkerQueryDTO,
  ): Promise<GetListBidsStationWorkerResponseDTO> {
    this.bindGeneralConditions(builder, data);
    this.bindPaginationAndSort(builder, data);

    const [items, totalItemsCount] =
      (await builder.getManyAndCount()) as unknown as [
        GetListBidsStationWorkerItemDTO[],
        number,
      ];

    return new GetListBidsStationWorkerResponseDTO({
      totalItemsCount,
      items,
      take: data.take,
      skip: data.skip || 0,
    });
  }

  public async getBidsListForMaster(
    builder: SelectQueryBuilder<BidEntity>,
    data: GetListBidsMasterQueryDTO,
  ): Promise<GetListBidsMasterResponseDTO> {
    this.mapBidsListForMaster(builder);
    this.bindGeneralConditions(builder, data);
    this.bindDistrictLeaderFilters(builder, data);
    this.bindMasterFilters(builder, data);
    this.bindPaginationAndSort(builder, data);

    const [items, totalItemsCount] =
      (await builder.getManyAndCount()) as unknown as [
        GetListBidsMasterItemDTO[],
        number,
      ];

    return new GetListBidsMasterResponseDTO({
      totalItemsCount,
      items,
      take: data.take,
      skip: data.skip || 0,
    });
  }

  private mapBidsListForMaster(builder: SelectQueryBuilder<BidEntity>): void {
    this.mapBidsListForDistrictLeader(builder);
    builder
      .leftJoinAndMapOne('b.station', 'b.station', 'st')
      .leftJoin(StationWorkerEntity, 'sw', '"sw"."stationId" = st.id')
      .leftJoin(ClientEntity, 'cl', 'cl.id = "st"."clientId"')
      .leftJoin(DistrictEntity, 'd', 'd.id = "st"."districtId"')
      .leftJoin(
        DistrictLeaderEntity,
        'dl',
        '"dl"."leaderDistrictId" = "st"."districtId"',
      )
      .leftJoinAndMapOne(
        'b.stationWorker',
        UserEntity,
        'swu',
        'swu.id = "sw"."userId"',
      )
      .leftJoinAndMapOne(
        'b.districtLeader',
        UserEntity,
        'dlu',
        'dlu.id = "dl"."userId"',
      );
  }

  private bindMasterFilters(
    builder: SelectQueryBuilder<BidEntity>,
    {
      clientIds,
      districtIds,
      stationsWorkersIds,
      districtsLeadersIds,
      stationsIds,
      search,
    }: Pick<
      GetListBidsMasterQueryDTO,
      | 'clientIds'
      | 'districtIds'
      | 'stationsWorkersIds'
      | 'districtsLeadersIds'
      | 'stationsIds'
      | 'search'
    >,
  ): void {
    if (search) {
      builder.andWhere(`st.number LIKE '%${search}%'`);
    }

    if (clientIds) {
      builder.andWhere('cl.id IN (:...ids)', {
        ids: clientIds,
      });
    }

    if (districtIds) {
      builder.andWhere('d.id IN (:...ids)', {
        ids: districtIds,
      });
    }

    if (stationsWorkersIds) {
      builder.andWhere('swu.id IN (:...ids)', {
        ids: stationsWorkersIds,
      });
    }

    if (districtsLeadersIds) {
      builder.andWhere('dlu.id IN (:...ids)', {
        ids: districtsLeadersIds,
      });
    }

    if (stationsIds) {
      builder.andWhere('st.id IN (:...ids)', {
        ids: stationsIds,
      });
    }
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
