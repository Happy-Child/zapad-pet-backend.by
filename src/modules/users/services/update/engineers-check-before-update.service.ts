import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { UsersUpdateEngineerDTO } from '../../dtos/users-update.dtos';
import { EngineerMemberDTO } from '../../dtos';
import {
  groupedByChangedFields,
  groupedByValueOfObjectKeyWillBe,
} from '@app/helpers/grouped.helpers';
import { isNonEmptyArray } from '@app/helpers';
import { DistrictsGeneralService } from '../../../districts/services';
import { BidEntity } from '@app/entities';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { EngineersRepository } from '../../repositories';
import {
  BID_STATUTES_BLOCKING_CHANGE_ENGINEER_ON_DISTRICT,
  USERS_ERRORS,
} from '../../constants';

@Injectable()
export class EngineersCheckBeforeUpdateService {
  constructor(
    private readonly districtsGeneralService: DistrictsGeneralService,
    private readonly engineersRepository: EngineersRepository,
  ) {}

  public async executeOrFail(
    engineers: NonEmptyArray<UsersUpdateEngineerDTO & { index: number }>,
    foundEngineers: EngineerMemberDTO[],
  ): Promise<void> {
    const groupedEngineersToCheck = groupedByChangedFields(
      engineers,
      foundEngineers,
      ['engineerDistrictId'],
    );

    await this.checkExistingDistrictsOrFail(
      groupedEngineersToCheck.engineerDistrictId,
      foundEngineers,
    );

    await this.canBeDeleteDistrictsOrFail(
      groupedEngineersToCheck.engineerDistrictId,
      foundEngineers,
    );
  }

  private async checkExistingDistrictsOrFail(
    groupByDistrictId: (UsersUpdateEngineerDTO & { index: number })[],
    foundEngineers: EngineerMemberDTO[],
  ): Promise<void> {
    const { added, replaced } = groupedByValueOfObjectKeyWillBe(
      groupByDistrictId,
      foundEngineers,
      'engineerDistrictId',
    );

    const records = [...added, ...replaced];

    if (isNonEmptyArray(records)) {
      const preparedRecords = records.map(({ engineerDistrictId, index }) => ({
        districtId: engineerDistrictId,
        index,
      })) as NonEmptyArray<{ districtId: number; index: number }>;

      await this.districtsGeneralService.allDistrictsExistsOrFail(
        preparedRecords,
      );
    }
  }

  private async canBeDeleteDistrictsOrFail(
    groupByDistrictId: (UsersUpdateEngineerDTO & { index: number })[],
    foundEngineers: EngineerMemberDTO[],
  ): Promise<void> {
    const { deleted } = groupedByValueOfObjectKeyWillBe(
      groupByDistrictId,
      foundEngineers,
      'engineerDistrictId',
    );

    if (isNonEmptyArray(deleted)) {
      await this.allEngineersCanBeChangeDistrictsOrFail(deleted);
    }
  }

  private async allEngineersCanBeChangeDistrictsOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
  ): Promise<void> {
    const ids = items.map(({ id }) => id) as NonEmptyArray<number>;

    const records = await this.engineersRepository
      .createQueryBuilder('e')
      .select('e.userId as id, COUNT(b.id)::int AS count')
      .where('e.userId IN (:...ids)', { ids })
      .leftJoin(
        BidEntity,
        'b',
        'b.engineerId = e.userId AND b.status IN (:...statuses)',
        { statuses: BID_STATUTES_BLOCKING_CHANGE_ENGINEER_ON_DISTRICT },
      )
      .groupBy('e.id')
      .getRawMany();

    const engineersForException = items.filter((item) =>
      records.find(({ id, count }) => id === item.id && count > 0),
    );

    if (engineersForException.length) {
      const preparedErrors = getPreparedChildrenErrors(engineersForException, {
        field: 'engineerDistrictId',
        messages: [USERS_ERRORS.IMPOSSIBLE_REMOVE_ENGINEER_FROM_DISTRICT],
      });
      throw new ExceptionsUnprocessableEntity(preparedErrors);
    }
  }
}
