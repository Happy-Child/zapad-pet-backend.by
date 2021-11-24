import { EntityRepository } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import {
  BidEntity,
  DistrictEntity,
  RegionEntity,
  StationEntity,
} from '@app/entities';
import { BidsGeneralService } from '../../bids/services';
import { RegionStatisticDTO } from '../dtos';

@EntityRepository(RegionEntity)
export class RegionsRepository extends GeneralRepository<RegionEntity> {
  protected entitySerializer = RegionEntity;

  public async getRegionStatisticById(id: number): Promise<RegionStatisticDTO> {
    const region = (await this.createQueryBuilder('r')
      .where({ id })
      .leftJoin(DistrictEntity, 'd', '"d"."regionSlug" = r.slug')
      .leftJoin(StationEntity, 'st', '"st"."districtId" = d.id')
      .leftJoinAndMapMany('r.bids', BidEntity, 'b', '"b"."stationId" = st.id')
      .getOne()) as unknown as RegionEntity & { bids: BidEntity[] };

    return new RegionStatisticDTO({
      bidsCountByStatuses: BidsGeneralService.getAggrBidsCountByStatuses(
        region.bids,
      ),
    });
  }
}
