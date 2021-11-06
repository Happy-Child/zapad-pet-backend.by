import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import {
  UsersUpdateDistrictLeaderDTO,
  UsersUpdateEngineerDTO,
  UsersUpdateItemDTO,
  UsersUpdateStationWorkerDTO,
} from '../../dtos/users-update.dtos';
import {
  groupedByChangedFields,
  groupedByRoles,
} from '@app/helpers/grouped.helpers';
import { isNonEmptyArray } from '@app/helpers';
import { TMemberDTO } from '../../types';
import { AccountantDTO } from '../../dtos';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { USERS_ERRORS } from '../../constants';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { StationsWorkersCheckBeforeUpdateService } from './stations-workers-check-before-update.service';
import { UsersGeneralService } from '../users-general.service';
import { UsersRepository } from '../../repositories';
import { DistrictsLeadersCheckBeforeUpdateService } from './districts-leaders-check-before-update.service';
import { EngineersCheckBeforeUpdateService } from './engineers-check-before-update.service';

@Injectable()
export class UsersCheckBeforeUpdateService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersGeneralService: UsersGeneralService,
    private readonly stationsWorkersCheckBeforeUpdateService: StationsWorkersCheckBeforeUpdateService,
    private readonly districtsLeadersCheckBeforeUpdateService: DistrictsLeadersCheckBeforeUpdateService,
    private readonly engineersCheckBeforeUpdateService: EngineersCheckBeforeUpdateService,
  ) {}

  public async executeOrFail(
    indexedUsers: NonEmptyArray<UsersUpdateItemDTO & { index: number }>,
  ): Promise<void> {
    const foundUsers = await this.allUsersExistingOrFail(indexedUsers);
    this.allUsersMatchRolesOrFail(indexedUsers, foundUsers);
    await this.allUpdatedEmailsNotExistingOrFail(indexedUsers, foundUsers);
    await this.checkMembersOfFail(indexedUsers, foundUsers);
  }

  private async checkMembersOfFail(
    indexedUsers: NonEmptyArray<UsersUpdateItemDTO & { index: number }>,
    foundUsers: (TMemberDTO | AccountantDTO)[],
  ): Promise<void> {
    const { stationsWorkers, districtsLeaders, engineers } = groupedByRoles<
      UsersUpdateStationWorkerDTO & { index: number },
      UsersUpdateDistrictLeaderDTO & { index: number },
      UsersUpdateEngineerDTO & { index: number }
    >(indexedUsers);

    const requestsToCheck = [];

    if (isNonEmptyArray(stationsWorkers)) {
      requestsToCheck.push(
        this.stationsWorkersCheckBeforeUpdateService.executeOrFail(
          stationsWorkers,
          foundUsers,
        ),
      );
    }
    if (isNonEmptyArray(districtsLeaders)) {
      requestsToCheck.push(
        this.districtsLeadersCheckBeforeUpdateService.executeOrFail(
          districtsLeaders,
          foundUsers,
        ),
      );
    }
    if (isNonEmptyArray(engineers)) {
      requestsToCheck.push(
        this.engineersCheckBeforeUpdateService.executeOrFail(
          engineers,
          foundUsers,
        ),
      );
    }

    await Promise.all(requestsToCheck);
  }

  private async allUsersExistingOrFail(
    users: NonEmptyArray<UsersUpdateItemDTO & { index: number }>,
  ): Promise<(TMemberDTO | AccountantDTO)[]> {
    const ids = users.map(({ id }) => id) as NonEmptyArray<number>;
    const foundUsers = await this.usersRepository.getUsersIds(ids);

    const foundUsersIds = foundUsers.map(({ id }) => id);
    if (foundUsersIds.length === ids.length) {
      return foundUsers;
    }

    const usersForException = users.filter(
      ({ id }) => !foundUsersIds.includes(id),
    );

    const preparedErrors = getPreparedChildrenErrors(usersForException, {
      field: 'id',
      messages: [USERS_ERRORS.USER_NOT_EXISTS],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  private allUsersMatchRolesOrFail(
    users: (UsersUpdateItemDTO & { index: number })[],
    foundUsers: (TMemberDTO | AccountantDTO)[],
  ): void {
    const usersWithInvalidRoles = users.filter(
      ({ id, role }) =>
        !foundUsers.find((item) => item.id === id && item.role === role),
    );

    if (usersWithInvalidRoles.length === 0) return;

    const preparedErrors = getPreparedChildrenErrors(usersWithInvalidRoles, {
      field: 'role',
      messages: [USERS_ERRORS.USER_HAS_OTHER_ROLE],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  private async allUpdatedEmailsNotExistingOrFail(
    users: (UsersUpdateItemDTO & { index: number })[],
    foundUsers: (TMemberDTO | AccountantDTO)[],
  ): Promise<void> {
    const { email: groupByEmail } = groupedByChangedFields(users, foundUsers, [
      'email',
    ]);

    if (isNonEmptyArray(groupByEmail)) {
      await this.usersGeneralService.allEmailsNotExistingOrFail(groupByEmail);
    }
  }
}
