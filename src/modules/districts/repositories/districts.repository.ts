import { EntityRepository } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import { BidEntity, DistrictEntity, StationEntity } from '@app/entities';
import { StationStatisticDTO } from '../../stations/dtos/stations-getting.dtos';
import { BidsGeneralService } from '../../bids/services';
import { DistrictStatisticDTO } from '../dtos/districts-getting.dtos';

@EntityRepository(DistrictEntity)
export class DistrictsRepository extends GeneralRepository<DistrictEntity> {
  protected entitySerializer = DistrictEntity;

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
}
