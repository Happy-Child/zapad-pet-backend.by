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
import {
  AccountantDTO,
  DistrictLeaderMemberDTO,
  EngineerMemberDTO,
  StationWorkerMemberDTO,
} from '../../dtos';
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
    foundUsers: (TMemberDTO | AccountantDTO)[],
  ): Promise<void> {
    this.allUsersMatchRolesOrFail(indexedUsers, foundUsers);
    await this.allUpdatedEmailsNotExistingOrFail(indexedUsers, foundUsers);
    await this.checkMembersOrFail(indexedUsers, foundUsers);
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

  private async checkMembersOrFail(
    indexedUsers: NonEmptyArray<UsersUpdateItemDTO & { index: number }>,
    foundUsers: (TMemberDTO | AccountantDTO)[],
  ): Promise<void> {
    const { stationsWorkers, districtsLeaders, engineers } = groupedByRoles<
      UsersUpdateStationWorkerDTO & { index: number },
      UsersUpdateDistrictLeaderDTO & { index: number },
      UsersUpdateEngineerDTO & { index: number }
    >(indexedUsers);

    const {
      stationsWorkers: foundStationsWorkers,
      districtsLeaders: foundDistrictsLeaders,
      engineers: foundEngineers,
    } = groupedByRoles<
      StationWorkerMemberDTO,
      DistrictLeaderMemberDTO,
      EngineerMemberDTO
    >(foundUsers);

    const requestsToCheck = [];

    if (isNonEmptyArray(stationsWorkers)) {
      requestsToCheck.push(
        this.stationsWorkersCheckBeforeUpdateService.executeOrFail(
          stationsWorkers,
          foundStationsWorkers,
        ),
      );
    }
    if (isNonEmptyArray(districtsLeaders)) {
      requestsToCheck.push(
        this.districtsLeadersCheckBeforeUpdateService.executeOrFail(
          districtsLeaders,
          foundDistrictsLeaders,
        ),
      );
    }
    if (isNonEmptyArray(engineers)) {
      requestsToCheck.push(
        this.engineersCheckBeforeUpdateService.executeOrFail(
          engineers,
          foundEngineers,
        ),
      );
    }

    await Promise.all(requestsToCheck);
  }
}
