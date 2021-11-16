import { Injectable } from '@nestjs/common';
import {
  UsersUpdateDistrictLeaderDTO,
  UsersUpdateEngineerDTO,
  UsersUpdateItemDTO,
  UsersUpdateRequestBodyDTO,
  UsersUpdateStationWorkerDTO,
} from '../../dtos/users-update.dtos';
import { EngineersRepository, UsersRepository } from '../../repositories';
import { getIndexedArray, isNonEmptyArray } from '@app/helpers';
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

@Injectable()
export class UsersUpdateService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersGeneralService: UsersGeneralService,
    private readonly usersCheckBeforeUpdateService: UsersCheckBeforeUpdateService,
    private readonly connection: Connection,
  ) {}

  public async execute({ users }: UsersUpdateRequestBodyDTO): Promise<void> {
    const indexedUsers = getIndexedArray(users);

    await this.connection.transaction(async (manager) => {
      await this.usersCheckBeforeUpdateService.executeOrFail(
        indexedUsers,
        manager,
      );
      await this.update(indexedUsers, manager);
    });
  }

  private async update(
    users: UsersUpdateItemDTO[],
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
        this.updateStationsWorkers(stationsWorkers, stationsWorkersRepository),
      );
    }
    if (isNonEmptyArray(districtsLeaders)) {
      requestsToUpdate.push(
        this.updateDistrictsLeaders(
          districtsLeaders,
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
    repository: StationsWorkersRepository,
  ): Promise<void> {
    const recordsToUpdate: IRepositoryUpdateEntitiesItem<StationWorkerEntity>[] =
      workers.map(({ id: userId, stationId, clientId }) => ({
        criteria: { userId },
        inputs: { stationId, clientId },
      }));

    await repository.updateEntities(recordsToUpdate);
  }

  private async updateDistrictsLeaders(
    leaders: UsersUpdateDistrictLeaderDTO[],
    repository: DistrictsLeadersRepository,
  ): Promise<void> {
    const recordsToUpdate: IRepositoryUpdateEntitiesItem<DistrictLeaderEntity>[] =
      leaders.map(({ id: userId, leaderDistrictId: districtId }) => ({
        criteria: { userId },
        inputs: { districtId },
      }));

    await repository.updateEntities(recordsToUpdate);
  }

  private async updateEngineers(
    engineers: UsersUpdateEngineerDTO[],
    repository: EngineersRepository,
  ): Promise<void> {
    const recordsToUpdate: IRepositoryUpdateEntitiesItem<EngineerEntity>[] =
      engineers.map(({ id: userId, engineerDistrictId: districtId }) => ({
        criteria: { userId },
        inputs: { districtId },
      }));

    await repository.updateEntities(recordsToUpdate);
  }
}
