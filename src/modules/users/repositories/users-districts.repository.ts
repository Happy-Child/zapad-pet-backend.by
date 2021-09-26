import { EntityRepository } from 'typeorm';
import { DistrictEntity } from '../../districts';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(DistrictEntity)
export class UsersDistrictsRepository extends GeneralRepository<DistrictEntity> {
  public async findEmptyDistrictsByIds(
    ids: number[],
  ): Promise<DistrictEntity[]> {
    if (!ids.length) return [];
    return this.createQueryBuilder('d')
      .where('d.id IN (:...ids) AND d.districtLeaderId IS NULL', { ids })
      .orderBy('d.id')
      .getMany();
  }
}
