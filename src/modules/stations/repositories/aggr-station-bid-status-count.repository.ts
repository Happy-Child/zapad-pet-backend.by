import { GeneralRepository } from '@app/repositories';
import { AggrStationBidStatusCountEntity } from '@app/entities';
import { EntityRepository } from 'typeorm';

@EntityRepository(AggrStationBidStatusCountEntity)
export class AggrStationBidStatusCountRepository extends GeneralRepository<AggrStationBidStatusCountEntity> {
  protected entitySerializer = AggrStationBidStatusCountEntity;

  public async incrementColumn(
    stationId: number,
    column: keyof Omit<
      AggrStationBidStatusCountEntity,
      'stationId' | 'station'
    >,
  ): Promise<void> {
    const record = await this.getOneOrFail({ stationId });
    record[column]++;
    await this.saveEntity(record);
  }
}
