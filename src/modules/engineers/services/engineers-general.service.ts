import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { EngineerMemberDTO } from '../dtos';
import { EntityFinderGeneralService } from '../../entity-finder/services';
import { USER_ROLES } from '@app/constants';
import { isNonEmptyArray, isNull, toObjectByField } from '@app/helpers';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { USERS_ERRORS } from '../../users/constants';
import {
  ExceptionsNotFound,
  ExceptionsUnprocessableEntity,
} from '@app/exceptions/errors';
import { BidEntity } from '@app/entities';
import { BID_STATUTES_BLOCKING_CHANGE_ENGINEER_ON_DISTRICT } from '../constants';
import { EngineersRepository } from '../repositories';

@Injectable()
export class EngineersGeneralService {
  constructor(
    private readonly engineersRepository: EngineersRepository,
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
  ) {}

  public async allEngineersExistingAndWithoutDistrictsOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
    exceptionField = 'ids',
  ): Promise<EngineerMemberDTO[]> {
    const engineers = (await this.allEngineersExistingOrFail(
      items,
      exceptionField,
    )) as NonEmptyArray<EngineerMemberDTO>;

    const groupedById = toObjectByField('id', engineers);
    const preparedEngineers = items.map((item) => ({
      ...item,
      engineerDistrictId: groupedById[item.id].engineerDistrictId,
    })) as NonEmptyArray<
      Pick<EngineerMemberDTO, 'engineerDistrictId' | 'id'> & { index: number }
    >;

    this.allEngineersWithoutDistrictsOrFail(preparedEngineers, exceptionField);

    return engineers;
  }

  public async allEngineersExistingOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
    exceptionField = 'ids',
  ): Promise<EngineerMemberDTO[]> {
    const users = await this.entityFinderGeneralService.allUsersExistingOrFail(
      items,
    );

    const idsInvalidUsers = users
      .filter(({ role }) => role !== USER_ROLES.ENGINEER)
      .map(({ id }) => id);
    const usersForException = items.filter(({ id }) =>
      idsInvalidUsers.includes(id),
    );

    if (isNonEmptyArray(usersForException)) {
      const preparedErrors = getPreparedChildrenErrors(usersForException, {
        field: exceptionField,
        messages: [USERS_ERRORS.SHOULD_BE_ENGINEER],
      });
      throw new ExceptionsNotFound(preparedErrors);
    }

    return users as EngineerMemberDTO[];
  }

  public allEngineersWithoutDistrictsOrFail(
    engineersToCheck: NonEmptyArray<
      Pick<EngineerMemberDTO, 'engineerDistrictId' | 'id'> & { index: number }
    >,
    exceptionField = 'ids',
  ): void {
    const engineersWithWorkers = engineersToCheck.filter(
      ({ engineerDistrictId }) => !isNull(engineerDistrictId),
    );

    if (engineersWithWorkers.length === 0) return;

    const engineersWithWorkersIds = engineersWithWorkers.map(({ id }) => id);
    const result = engineersToCheck.filter(({ id }) =>
      engineersWithWorkersIds.includes(id),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: exceptionField,
      messages: [USERS_ERRORS.ENGINEER_SHOULD_BE_WITHOUT_DISTRICT],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  public async allEngineersHaveDistrictOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
    districtId: number,
    exceptionField = 'ids',
  ): Promise<void> {
    const ids = items.map(({ id }) => id) as NonEmptyArray<number>;

    const engineers = await this.engineersRepository.getManyByColumn(
      ids,
      'userId',
    );

    const engineersForException = items.filter((item) =>
      engineers.find(
        ({ userId, engineerDistrictId }) =>
          userId === item.id && engineerDistrictId !== districtId,
      ),
    );

    if (engineersForException.length) {
      const preparedErrors = getPreparedChildrenErrors(engineersForException, {
        field: exceptionField,
        messages: [USERS_ERRORS.ENGINEER_NOT_HAVE_THIS_DISTRICT],
      });
      throw new ExceptionsUnprocessableEntity(preparedErrors);
    }
  }

  public async allEngineersCanBeChangeDistrictsOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
    exceptionField = 'engineerDistrictId',
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
        field: exceptionField,
        messages: [USERS_ERRORS.IMPOSSIBLE_REMOVE_ENGINEER_FROM_DISTRICT],
      });
      throw new ExceptionsUnprocessableEntity(preparedErrors);
    }
  }
}
