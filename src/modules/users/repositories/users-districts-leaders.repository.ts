import { EntityRepository } from 'typeorm';
import { DistrictLeaderEntity } from '@app/entities';
import { GeneralRepository } from '@app/repositories';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ENTITIES_FIELDS } from '@app/constants';
import { AUTH_ERRORS } from '../../auth/constants';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { NonEmptyArray } from '@app/types';

@EntityRepository(DistrictLeaderEntity)
export class UsersDistrictsLeadersRepository extends GeneralRepository<DistrictLeaderEntity> {
  protected entitySerializer = DistrictLeaderEntity;

  public async returnEmptyDistrictsIds(
    ids: NonEmptyArray<number>,
  ): Promise<number[]> {
    const records = await this.getManyByColumn(ids, 'districtId');
    const recordsIds = records.map(({ districtId }) => districtId);

    return ids.filter((id) => !recordsIds.includes(id));
  }

  public async districtsWithoutLeadersOrFail(
    items: NonEmptyArray<{ index: number; districtId: number }>,
  ): Promise<void> {
    const districtsIds = items.map(
      ({ districtId }) => districtId,
    ) as NonEmptyArray<number>;
    const emptyDistrictsIds = await this.returnEmptyDistrictsIds(districtsIds);

    if (emptyDistrictsIds.length === districtsIds.length) return;

    const itemsWithNotEmptyDistricts = items.filter(
      ({ districtId }) => !emptyDistrictsIds.includes(districtId),
    );

    const preparedErrors = getPreparedChildrenErrors(
      itemsWithNotEmptyDistricts,
      {
        field: ENTITIES_FIELDS.DISTRICT_ID,
        messages: [AUTH_ERRORS.DISTRICT_NOT_EMPTY],
      },
    );
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }
}
