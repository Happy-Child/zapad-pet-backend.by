import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import {
  BidEntity,
  DistrictEntity,
  EngineerEntity,
  RegionEntity,
  StationEntity,
} from '@app/entities';
import {
  RegionDTO,
  RegionsGetAllResponseBodyDTO,
  RegionStatisticDTO,
} from '../dtos';
import { getAggrBidsCountByStatuses } from '@app/helpers';

@EntityRepository(RegionEntity)
export class RegionsRepository extends GeneralRepository<RegionEntity> {
  protected entitySerializer = RegionEntity;

  public async getAll(): Promise<RegionsGetAllResponseBodyDTO> {
    const queryBuilder = this.createQueryBuilder('r').select(
      'r.*, COUNT(st.id)::int "countOfStations", COUNT(e.id)::int "countOfEngineers"',
    );

    this.mapDetailsToRegions(queryBuilder);

    const totalItemsCount = await this.count();
    const items = await queryBuilder.getRawMany<RegionDTO>();

    return new RegionsGetAllResponseBodyDTO({
      items,
      totalItemsCount,
    });
  }

  private mapDetailsToRegions(builder: SelectQueryBuilder<RegionEntity>): void {
    builder
      .leftJoin(DistrictEntity, 'd', '"d"."regionSlug" = r.slug')
      .leftJoin(StationEntity, 'st', '"st"."districtId" = d.id')
      .leftJoin(EngineerEntity, 'e', '"e"."engineerDistrictId" = d.id')
      .groupBy('r.id');
  }

  public async getRegionStatisticById(id: number): Promise<RegionStatisticDTO> {
    const region = (await this.createQueryBuilder('r')
      .where({ id })
      .leftJoin(DistrictEntity, 'd', '"d"."regionSlug" = r.slug')
      .leftJoin(StationEntity, 'st', '"st"."districtId" = d.id')
      .leftJoinAndMapMany('r.bids', BidEntity, 'b', '"b"."stationId" = st.id')
      .getOne()) as unknown as RegionEntity & { bids: BidEntity[] };

    return new RegionStatisticDTO({
      bidsCountByStatuses: getAggrBidsCountByStatuses(region.bids),
    });
  }
}
