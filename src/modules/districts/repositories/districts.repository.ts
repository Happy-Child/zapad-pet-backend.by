import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import {
  BidEntity,
  DistrictEntity,
  DistrictLeaderEntity,
  EngineerEntity,
  StationEntity,
  UserEntity,
} from '@app/entities';
import { StationStatisticDTO } from '../../stations/dtos/stations-getting.dtos';
import { BidsGeneralService } from '../../bids/services';
import {
  DistrictsGetAllResponseBodyDTO,
  DistrictStatisticDTO,
  DistrictDTO,
  DistrictWithStatisticsDTO,
} from '../dtos/districts-getting.dtos';
import { ShortEngineerMemberDTO } from '../../engineers/dtos';

@EntityRepository(DistrictEntity)
export class DistrictsRepository extends GeneralRepository<DistrictEntity> {
  protected entitySerializer = DistrictEntity;

  public async getAll(): Promise<DistrictsGetAllResponseBodyDTO> {
    const queryBuilder = this.createQueryBuilder('d');

    this.mapDetailsToDistricts(queryBuilder);

    const [items, totalItemsCount] =
      (await queryBuilder.getManyAndCount()) as unknown as [
        DistrictDTO[],
        number,
      ];

    return new DistrictsGetAllResponseBodyDTO({
      items,
      totalItemsCount,
    });
  }

  public async getEngineersById(id: number): Promise<ShortEngineerMemberDTO[]> {
    const item = await this.createQueryBuilder('d')
      .where({ id })
      .leftJoin(EngineerEntity, 'e', '"e"."engineerDistrictId" = :id', { id })
      .leftJoinAndMapMany('d.engineers', UserEntity, 'u', '"e"."userId" = u.id')
      .getOne();

    return item?.engineers.map((e) => new ShortEngineerMemberDTO(e)) || [];
  }

  public async getDistrictStatisticById(
    id: number,
  ): Promise<StationStatisticDTO> {
    const district = (await this.createQueryBuilder('d')
      .where({ id })
      .leftJoin(StationEntity, 'st', '"st"."districtId" = :id', { id })
      .leftJoinAndMapMany('d.bids', BidEntity, 'b', '"b"."stationId" = st.id')
      .getOne()) as unknown as DistrictEntity & { bids: BidEntity[] };

    return new DistrictStatisticDTO({
      bidsCountByStatuses: BidsGeneralService.getAggrBidsCountByStatuses(
        district.bids,
      ),
    });
  }

  public async getSingleDistrict(
    id: number,
  ): Promise<DistrictWithStatisticsDTO> {
    const queryBuilder = this.createQueryBuilder('d')
      .where({ id })
      .leftJoin(StationEntity, 'st', '"st"."districtId" = :id', { id })
      .leftJoinAndMapMany('d.bids', BidEntity, 'b', '"b"."stationId" = st.id');

    this.mapDetailsToDistricts(queryBuilder);

    const district = (await queryBuilder.getOne()) as unknown as DistrictDTO & {
      bids: BidEntity[];
    };

    const bidsCountByStatuses = BidsGeneralService.getAggrBidsCountByStatuses(
      district.bids,
    );

    return new DistrictWithStatisticsDTO({
      ...district,
      statistics: { bidsCountByStatuses },
    });
  }

  private mapDetailsToDistricts(
    builder: SelectQueryBuilder<DistrictEntity>,
  ): void {
    builder
      .leftJoin(DistrictLeaderEntity, 'dl', '"dl"."leaderDistrictId" = d.id')
      .leftJoinAndMapOne(
        'd.districtLeader',
        UserEntity,
        'u',
        '"dl"."userId" = u.id',
      )
      .loadRelationCountAndMap('d.countOfEngineers', 'd.engineers')
      .loadRelationCountAndMap('d.countOfStations', 'd.stations')
      .orderBy('d.id');
  }
}
