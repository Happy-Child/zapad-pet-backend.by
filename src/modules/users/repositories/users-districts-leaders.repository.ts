import { EntityRepository } from 'typeorm';
import { DistrictLeaderEntity } from '../entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(DistrictLeaderEntity)
export class UsersDistrictsLeadersRepository extends GeneralRepository<DistrictLeaderEntity> {
  protected entitySerializer = DistrictLeaderEntity;

  public async getEmptyDistrictsIds(ids: number[]): Promise<number[]> {
    if (!ids.length) return [];

    const records = await this.getManyByColumn(ids, 'districtId');
    const recordsIds = records.map(({ districtId }) => districtId);

    return ids.filter((id) => !recordsIds.includes(id));
  }
}
