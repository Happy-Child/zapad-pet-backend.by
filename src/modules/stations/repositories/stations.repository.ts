import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import {
  BidEntity,
  DistrictEntity,
  RegionEntity,
  StationEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import { NonEmptyArray } from '@app/types';
import { BID_STATUS } from '../../bids/constants';
import { StationExtendedDTO } from '../dtos';
import {
  StationDTO,
  StationsGetListRequestQueryDTO,
  StationsGetListResponseBodyDTO,
  StationWithStatisticsDTO,
} from '../dtos/stations-getting.dtos';
import {
  STATIONS_LIST_DEFAULT_SORT_BY,
  STATIONS_LIST_DEFAULT_SORT_DURATION,
  STATIONS_SORT_BY,
} from '../constants';
import { isUndefined } from '@app/helpers';
import { BidsGeneralService } from '../../bids/services';

const getTotalStationsListSortBy = (type: STATIONS_SORT_BY): string => {
  switch (type) {
    case STATIONS_SORT_BY.CLIENT_NAME:
      return 'cl.name';
    case STATIONS_SORT_BY.CREATED_AT:
      return '"st"."createdAt"';
    case STATIONS_SORT_BY.DISTRICT_NAME:
      return 'd.name';
    case STATIONS_SORT_BY.NUMBER:
      return 'st.number';
    case STATIONS_SORT_BY.STATION_WORKER_NAME:
      return 'u.name';
  }
};

@EntityRepository(StationEntity)
export class StationsRepository extends GeneralRepository<StationEntity> {
  protected entitySerializer = StationEntity;

  public async getStationsByIds(
    ids: NonEmptyArray<number>,
  ): Promise<StationExtendedDTO[]> {
    const items = await this.createQueryBuilder('st')
      .select('st.*, sw.userId as "stationWorkerId"')
      .where(`st.id IN (:...ids)`, { ids })
      .leftJoin(
        StationWorkerEntity,
        'sw',
        '"sw"."stationId" = st.id AND "sw"."clientId" = st.clientId',
      )
      .orderBy(`st.id`)
      .getRawMany();

    return items.map((item) => new StationExtendedDTO(item));
  }

  public async getStationsWithAggrBidsByStatuses(
    ids: NonEmptyArray<number>,
    statuses: NonEmptyArray<BID_STATUS>,
  ): Promise<{ id: number; count: number }[]> {
    return this.createQueryBuilder('st')
      .select('st.id as id, COUNT(b.id)::int AS count')
      .where('st.id IN (:...ids)', { ids })
      .leftJoin(
        BidEntity,
        'b',
        `"b"."stationId" = st.id AND b.status IN (:...statuses)`,
        { statuses },
      )
      .groupBy('st.id')
      .getRawMany();
  }

  public async getStationWithStatistic(
    id: number,
  ): Promise<StationWithStatisticsDTO> {
    const queryBuilder = this.createQueryBuilder('st');

    this.mapDetailsToStations(queryBuilder);

    queryBuilder
      .where({ id })
      .leftJoinAndMapMany('st.bids', BidEntity, 'b', '"b"."stationId" = :id', {
        id,
      });

    const station = (await queryBuilder.getOne()) as unknown as StationDTO & {
      bids: BidEntity[];
    };
    const bidsCountByStatuses = BidsGeneralService.getAggrBidsCountByStatuses(
      station.bids,
    );

    return new StationWithStatisticsDTO({
      ...station,
      statistics: { bidsCountByStatuses },
    });
  }

  public async getStationsWithPagination(
    data: StationsGetListRequestQueryDTO,
  ): Promise<StationsGetListResponseBodyDTO> {
    const totalSkip = data.skip || 0;
    const totalSortBy = getTotalStationsListSortBy(
      data.sortBy || STATIONS_LIST_DEFAULT_SORT_BY,
    );
    const totalSortDuration =
      data.sortDuration || STATIONS_LIST_DEFAULT_SORT_DURATION;

    const queryBuilder = this.createQueryBuilder('st');

    this.mapDetailsToStations(queryBuilder);
    this.bindConditionsToStationsPagination(data, queryBuilder);

    const [items, count] = (await queryBuilder
      .orderBy(totalSortBy, totalSortDuration)
      .offset(totalSkip)
      .limit(data.take)
      .getManyAndCount()) as unknown as [StationDTO[], number];

    return new StationsGetListResponseBodyDTO({
      totalItemsCount: count,
      items,
      skip: totalSkip,
      take: data.take,
    });
  }

  private bindConditionsToStationsPagination(
    data: StationsGetListRequestQueryDTO,
    queryBuilder: SelectQueryBuilder<StationEntity>,
  ): void {
    if (data.search) {
      queryBuilder.andWhere(`number LIKE '%${data.search}%'`);
    }

    const districtsAndClientsParams = {
      districtIds: data.districtIds,
      clientIds: data.clientIds,
    };
    if (
      districtsAndClientsParams.districtIds?.length &&
      districtsAndClientsParams.clientIds?.length
    ) {
      queryBuilder
        .andWhere(
          '"st"."clientId" IN (:...clientIds) OR "st"."districtId" IN (:...districtIds)',
          districtsAndClientsParams,
        )
        .orWhere(
          '"st"."districtId" IN (:...districtIds) OR "st"."clientId" IN (:...clientIds)',
          districtsAndClientsParams,
        );
    } else {
      if (districtsAndClientsParams.districtIds?.length) {
        queryBuilder.andWhere(`"st"."districtId" IN (:...ids)`, {
          ids: districtsAndClientsParams.districtIds,
        });
      }
      if (districtsAndClientsParams.clientIds?.length) {
        queryBuilder.andWhere(`"st"."clientId" IN (:...ids)`, {
          ids: districtsAndClientsParams.clientIds,
        });
      }
    }

    if (!isUndefined(data.withBids)) {
      queryBuilder.leftJoin(BidEntity, 'b', '"b"."stationId" = st.id');
      if (data.withBids) {
        queryBuilder.andWhere('b.id IS NOT NULL');
      } else {
        queryBuilder.andWhere('b.id IS NULL');
      }
    }

    if (!isUndefined(data.withWorker)) {
      if (data.withWorker) {
        queryBuilder.andWhere('sw.id IS NOT NULL');
      } else {
        queryBuilder.andWhere('sw.id IS NULL');
      }
    }
  }

  private mapDetailsToStations(
    builder: SelectQueryBuilder<StationEntity>,
  ): void {
    builder.leftJoinAndMapOne('st.client', 'st.client', 'cl');
    builder.leftJoinAndMapOne(
      'st.district',
      DistrictEntity,
      'd',
      'd.id = "st"."districtId"',
    );
    builder.leftJoinAndMapOne(
      'st.region',
      RegionEntity,
      'r',
      'r.slug = "d"."regionSlug"',
    );
    builder
      .leftJoin(StationWorkerEntity, 'sw', '"sw"."stationId" = st.id')
      .leftJoinAndMapOne(
        'st.stationWorker',
        UserEntity,
        'u',
        'u.id = "sw"."userId"',
      );
  }
}
