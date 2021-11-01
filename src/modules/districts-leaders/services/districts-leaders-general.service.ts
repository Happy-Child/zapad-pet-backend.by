import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { AUTH_ERRORS } from '../../auth/constants';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { DistrictsLeadersRepository } from '../repositories';

@Injectable()
export class DistrictsLeadersGeneralService {
  constructor(
    private readonly districtsLeadersRepository: DistrictsLeadersRepository,
  ) {}

  public async allDistrictsWithoutLeadersOrFail(
    items: NonEmptyArray<{ index: number; leaderDistrictId: number }>,
  ): Promise<void> {
    const districtsIds = items.map(
      ({ leaderDistrictId }) => leaderDistrictId,
    ) as NonEmptyArray<number>;
    const emptyDistrictsIds =
      await this.districtsLeadersRepository.returnNotExistingColumnValues(
        'districtId',
        districtsIds,
      );

    if (emptyDistrictsIds.length === districtsIds.length) return;

    const itemsWithNotEmptyDistricts = items.filter(
      ({ leaderDistrictId }) => !emptyDistrictsIds.includes(leaderDistrictId),
    );

    const preparedErrors = getPreparedChildrenErrors(
      itemsWithNotEmptyDistricts,
      {
        field: 'leaderDistrictId',
        messages: [AUTH_ERRORS.DISTRICT_NOT_EMPTY],
      },
    );
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }
}
