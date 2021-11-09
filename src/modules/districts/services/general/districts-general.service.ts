import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { DistrictsRepository } from '../../repositories';
import { getItemsByUniqueField } from '@app/helpers';
import { AUTH_ERRORS } from '../../../auth/constants';
import { BidEntity, StationEntity } from '@app/entities';
import { BID_STATUTES_BLOCKING_CHANGE_LEADER_ON_DISTRICT } from '../../constants';

@Injectable()
export class DistrictsGeneralService {
  constructor(private readonly districtsRepository: DistrictsRepository) {}

  public async allDistrictsExistsOrFail(
    items: NonEmptyArray<{ districtId: number; index: number }>,
    exceptionField = 'leaderDistrictId',
  ): Promise<void> {
    const uniqueIds = getItemsByUniqueField<{ districtId: number }>(
      'districtId',
      items,
    );

    const foundEntities = await this.districtsRepository.getManyByColumn(
      uniqueIds,
    );
    const allIdsExists = foundEntities.length === uniqueIds.length;

    if (allIdsExists) return;

    const foundEntitiesIds = foundEntities.map(({ id }) => id);
    const result = items.filter(
      (item) => !foundEntitiesIds.includes(item.districtId),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: exceptionField,
      messages: [AUTH_ERRORS.DISTRICT_NOT_EXIST],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  public async allDistrictsCanBeChangeLeadersOrFail(
    items: NonEmptyArray<{ districtId: number; index: number }>,
  ): Promise<void> {
    const ids = items.map(({ districtId }) => districtId);

    const records = await this.districtsRepository
      .createQueryBuilder('d')
      .select('d.id as id, COUNT(d.id)::int as count')
      .where('d.id IN (:...ids)', { ids })
      .leftJoin(StationEntity, 'st')
      .leftJoin(
        BidEntity,
        'b',
        '"b"."stationId" = st.id AND b.status IN (:...statuses)',
        { statuses: BID_STATUTES_BLOCKING_CHANGE_LEADER_ON_DISTRICT },
      )
      .groupBy('st.id')
      .getRawMany();

    console.log(records);
  }
}
