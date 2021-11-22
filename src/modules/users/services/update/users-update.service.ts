import { Injectable } from '@nestjs/common';
import {
  UsersUpdateDistrictLeaderDTO,
  UsersUpdateEngineerDTO,
  UsersUpdateItemDTO,
  UsersUpdateRequestBodyDTO,
  UsersUpdateStationWorkerDTO,
} from '../../dtos/users-update.dtos';
import { EngineersRepository, UsersRepository } from '../../repositories';
import {
  getIndexedArray,
  groupedByValueOfObjectKeyWillBe,
  isNonEmptyArray,
} from '@app/helpers';
import { UsersGeneralService } from '../users-general.service';
import { UsersCheckBeforeUpdateService } from './users-check-before-update.service';
import { groupedByRoles } from '@app/helpers/grouped.helpers';
import { StationsWorkersRepository } from '../../../stations-workers/repositories';
import { Connection, EntityManager } from 'typeorm';
import { IRepositoryUpdateEntitiesItem } from '@app/repositories/interfaces';
import {
  DistrictLeaderEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import { DistrictsLeadersRepository } from '../../../districts-leaders/repositories';
import { TUserDTO } from '../../types';
import { NonEmptyArray } from '@app/types';
import { DistrictLeaderMemberDTO, StationWorkerMemberDTO } from '../../dtos';
import { USER_ROLES } from '@app/constants';

@Injectable()
export class UsersUpdateService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersGeneralService: UsersGeneralService,
    private readonly usersCheckBeforeUpdateService: UsersCheckBeforeUpdateService,
    private readonly connection: Connection,
  ) {}

  public async execute({
    users,
  }: UsersUpdateRequestBodyDTO): Promise<TUserDTO[]> {
    const indexedUsers = getIndexedArray(users);

    const foundUsers = await this.usersGeneralService.allUsersExistingOrFail(
      indexedUsers,
    );

    await this.connection.transaction(async (manager) => {
      await this.usersCheckBeforeUpdateService.executeOrFail(
        indexedUsers,
        foundUsers,
      );
      await this.update(indexedUsers, foundUsers, manager);
    });

    const ids = indexedUsers.map(({ id }) => id) as NonEmptyArray<number>;
    return this.usersRepository.getUsersByIds(ids);
  }

  private async update(
    users: UsersUpdateItemDTO[],
    foundUsers: TUserDTO[],
    manager: EntityManager,
  ): Promise<void> {
    const usersRepository = manager.getCustomRepository(UsersRepository);
    await this.updateUsers(users, usersRepository);

    const stationsWorkersRepository = manager.getCustomRepository(
      StationsWorkersRepository,
    );
    const districtsLeadersRepository = manager.getCustomRepository(
      DistrictsLeadersRepository,
    );
    const engineersRepository =
      manager.getCustomRepository(EngineersRepository);

    await this.updateMembers(
      users,
      foundUsers,
      stationsWorkersRepository,
      districtsLeadersRepository,
      engineersRepository,
    );
  }

  private async updateUsers(
    users: UsersUpdateItemDTO[],
    repository: UsersRepository,
  ): Promise<void> {
    const recordsToUpdate: IRepositoryUpdateEntitiesItem<UserEntity>[] =
      users.map(({ id, email, name }) => ({
        criteria: { id },
        inputs: { email, name },
      }));
    await repository.updateEntities(recordsToUpdate);
  }

  private async updateMembers(
    users: UsersUpdateItemDTO[],
    foundUsers: TUserDTO[],
    stationsWorkersRepository: StationsWorkersRepository,
    districtsLeadersRepository: DistrictsLeadersRepository,
    engineersRepository: EngineersRepository,
  ): Promise<void> {
    const { stationsWorkers, districtsLeaders, engineers } = groupedByRoles<
      UsersUpdateStationWorkerDTO,
      UsersUpdateDistrictLeaderDTO,
      UsersUpdateEngineerDTO
    >(users);

    const requestsToUpdate = [];

    if (isNonEmptyArray(stationsWorkers)) {
      requestsToUpdate.push(
        this.updateStationsWorkers(
          stationsWorkers,
          foundUsers,
          stationsWorkersRepository,
        ),
      );
    }
    if (isNonEmptyArray(districtsLeaders)) {
      requestsToUpdate.push(
        this.updateDistrictsLeaders(
          districtsLeaders,
          foundUsers,
          districtsLeadersRepository,
        ),
      );
    }
    if (isNonEmptyArray(engineers)) {
      requestsToUpdate.push(
        this.updateEngineers(engineers, engineersRepository),
      );
    }

    await Promise.all(requestsToUpdate);
  }

  private async updateStationsWorkers(
    workers: UsersUpdateStationWorkerDTO[],
    foundUsers: TUserDTO[],
    repository: StationsWorkersRepository,
  ): Promise<void> {
    const { added, replaced, deleted } = groupedByValueOfObjectKeyWillBe(
      workers,
      foundUsers as StationWorkerMemberDTO[],
      'stationId',
    );

    const preparedReplacedRecords = replaced.map(
      ({ stationId }) =>
        foundUsers.find(
          (item): item is StationWorkerMemberDTO =>
            item.role === USER_ROLES.STATION_WORKER &&
            item.stationId === stationId,
        )!,
    );
    const recordsToDelete = [...deleted, ...preparedReplacedRecords];
    if (isNonEmptyArray(recordsToDelete)) {
      const records: IRepositoryUpdateEntitiesItem<StationWorkerEntity>[] =
        recordsToDelete.map(({ id: userId, stationId, clientId }) => ({
          criteria: { userId },
          inputs: { stationId, clientId },
        }));
      await repository.updateEntities(records);
    }

    const addedAndReplacedWorkers = [...added, ...replaced];
    if (isNonEmptyArray(addedAndReplacedWorkers)) {
      const recordsToUpdate: IRepositoryUpdateEntitiesItem<StationWorkerEntity>[] =
        addedAndReplacedWorkers.map(({ id: userId, clientId, stationId }) => ({
          criteria: { userId },
          inputs: { clientId, stationId },
        }));
      await repository.updateEntities(recordsToUpdate);
    }
  }

  private async updateDistrictsLeaders(
    leaders: UsersUpdateDistrictLeaderDTO[],
    foundUsers: TUserDTO[],
    repository: DistrictsLeadersRepository,
  ): Promise<void> {
    const { added, replaced, deleted } = groupedByValueOfObjectKeyWillBe(
      leaders,
      foundUsers as DistrictLeaderMemberDTO[],
      'leaderDistrictId',
    );

    const preparedReplacedRecords = replaced.map(
      ({ leaderDistrictId }) =>
        foundUsers.find(
          (item): item is DistrictLeaderMemberDTO =>
            item.role === USER_ROLES.DISTRICT_LEADER &&
            item.leaderDistrictId === leaderDistrictId,
        )!,
    );
    const recordsToDelete = [...deleted, ...preparedReplacedRecords];
    if (isNonEmptyArray(recordsToDelete)) {
      const records: IRepositoryUpdateEntitiesItem<DistrictLeaderEntity>[] =
        recordsToDelete.map(({ id: userId }) => ({
          criteria: { userId },
          inputs: { leaderDistrictId: null },
        }));
      await repository.updateEntities(records);
    }

    const recordsToAddedAndReplaced = [...added, ...replaced];
    if (isNonEmptyArray(recordsToAddedAndReplaced)) {
      const records: IRepositoryUpdateEntitiesItem<DistrictLeaderEntity>[] =
        recordsToAddedAndReplaced.map(({ id: userId, leaderDistrictId }) => ({
          criteria: { userId },
          inputs: { leaderDistrictId },
        }));
      await repository.updateEntities(records);
    }
  }

  private async updateEngineers(
    engineers: UsersUpdateEngineerDTO[],
    repository: EngineersRepository,
  ): Promise<void> {
    const records: IRepositoryUpdateEntitiesItem<EngineerEntity>[] =
      engineers.map(({ id: userId, engineerDistrictId }) => ({
        criteria: { userId },
        inputs: { engineerDistrictId },
      }));

    await repository.updateEntities(records);
  }
}
