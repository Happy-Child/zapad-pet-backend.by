import { EntityRepository } from 'typeorm';
import { GeneralRepository } from '@app/repositories';
import { getItemsByUniqueField } from '@app/helpers';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ENTITIES_FIELDS } from '@app/constants';
import { AUTH_ERRORS } from '../../auth/constants';
import { DistrictEntity } from '@app/entities';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { NonEmptyArray } from '@app/types';

@EntityRepository(DistrictEntity)
export class DistrictsRepository extends GeneralRepository<DistrictEntity> {
  protected entitySerializer = DistrictEntity;

  public async districtsExistsOrFail(
    items: NonEmptyArray<{ districtId: number; index: number }>,
  ): Promise<void> {
    // TODO метод за это не отвечат
    const uniqueIds = getItemsByUniqueField<{ districtId: number }>(
      'districtId',
      items,
    );

    const foundEntities = await this.getManyByColumn(uniqueIds);
    const allIdsExists = foundEntities.length === uniqueIds.length;

    if (allIdsExists) return;

    const foundEntitiesIds = foundEntities.map(({ id }) => id);
    const result = items.filter(
      (item) => !foundEntitiesIds.includes(item.districtId),
    );

    if (result.length) {
      const preparedErrors = getPreparedChildrenErrors(result, {
        field: ENTITIES_FIELDS.DISTRICT_ID,
        messages: [AUTH_ERRORS.DISTRICT_NOT_EXIST],
      });
      throw new ExceptionsUnprocessableEntity(preparedErrors);
    }
  }
}
