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
import { TMemberDTO } from '../../types';
import {
  AccountantDTO,
  DistrictLeaderMemberDTO,
  EngineerMemberDTO,
  StationWorkerMemberDTO,
} from '../../dtos';
import {
  groupedByChangedFields,
  groupedByNextStateValues,
  groupedByRoles,
} from '@app/helpers/grouped.helpers';
import { StationsWorkersRepository } from '../../../stations-workers/repositories';
import { Connection } from 'typeorm';
import { IRepositoryUpdateEntitiesItem } from '@app/repositories/interfaces';
import {
  DistrictLeaderEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import { DistrictsLeadersRepository } from '../../../districts-leaders/repositories';
import { GROUPED_UPDATING_STATIONS_WORKERS_FIELDS } from '../../constants';

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

    const foundUsers = await this.usersGeneralService.allUsersExistingOrFail(
      indexedUsers,
    );

    await this.usersCheckBeforeUpdateService.executeOrFail(
      indexedUsers,
      foundUsers,
    );

    await this.update(indexedUsers, foundUsers);
  }

  private async update(
    users: UsersUpdateItemDTO[],
    foundUsers: (TMemberDTO | AccountantDTO)[],
  ): Promise<void> {
    await this.connection.transaction(async (manager) => {
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
    });
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
    foundUsers: (TMemberDTO | AccountantDTO)[],
    stationsWorkersRepository: StationsWorkersRepository,
    districtsLeadersRepository: DistrictsLeadersRepository,
    engineersRepository: EngineersRepository,
  ): Promise<void> {
    const { stationsWorkers, districtsLeaders, engineers } = groupedByRoles<
      UsersUpdateStationWorkerDTO,
      UsersUpdateDistrictLeaderDTO,
      UsersUpdateEngineerDTO
    >(users);

    const {
      stationsWorkers: foundStationsWorkers,
      districtsLeaders: foundDistrictsLeaders,
      engineers: foundEngineers,
    } = groupedByRoles<
      StationWorkerMemberDTO,
      DistrictLeaderMemberDTO,
      EngineerMemberDTO
    >(foundUsers);

    const requestsToUpdate = [];

    if (isNonEmptyArray(stationsWorkers)) {
      requestsToUpdate.push(
        this.updateStationsWorkers(
          stationsWorkers,
          foundStationsWorkers,
          stationsWorkersRepository,
        ),
      );
    }
    if (isNonEmptyArray(districtsLeaders)) {
      requestsToUpdate.push(
        this.updateDistrictsLeaders(
          districtsLeaders,
          foundDistrictsLeaders,
          districtsLeadersRepository,
        ),
      );
    }
    if (isNonEmptyArray(engineers)) {
      requestsToUpdate.push(
        this.updateEngineers(engineers, foundEngineers, engineersRepository),
      );
    }

    await Promise.all(requestsToUpdate);
  }

  private async updateStationsWorkers(
    workers: UsersUpdateStationWorkerDTO[],
    foundWorkers: StationWorkerMemberDTO[],
    repository: StationsWorkersRepository,
  ): Promise<void> {
    const groupedWorkers = groupedByChangedFields(
      workers,
      foundWorkers,
      GROUPED_UPDATING_STATIONS_WORKERS_FIELDS,
    );

    const groupedByClientIdNextValue = groupedByNextStateValues(
      groupedWorkers.stationId,
      foundWorkers,
      'stationId',
    );

    const groupedByStationIdNextValue = groupedByNextStateValues(
      groupedWorkers.clientId,
      foundWorkers,
      'clientId',
    );

    const addedAndReplaced = [
      ...groupedByClientIdNextValue.replaced,
      ...groupedByClientIdNextValue.added,
      ...groupedByStationIdNextValue.replaced,
      ...groupedByStationIdNextValue.added,
    ];

    const recordsToUpdate: IRepositoryUpdateEntitiesItem<StationWorkerEntity>[] =
      [];

    // TODO delete "stationId" implement on stage of data checking before saving (usersCheckBeforeUpdateService.executeOrFail)

    if (isNonEmptyArray(addedAndReplaced)) {
      const records: IRepositoryUpdateEntitiesItem<StationWorkerEntity>[] =
        addedAndReplaced.map(({ id: userId, stationId, clientId }) => ({
          criteria: { userId },
          inputs: { stationId, clientId },
        }));
      recordsToUpdate.push(...records);
    }

    return repository.updateEntities(recordsToUpdate);
  }

  private async updateDistrictsLeaders(
    leaders: UsersUpdateDistrictLeaderDTO[],
    foundLeaders: DistrictLeaderMemberDTO[],
    repository: DistrictsLeadersRepository,
  ): Promise<void> {
    const { leaderDistrictId } = groupedByChangedFields(leaders, foundLeaders, [
      'leaderDistrictId',
    ]);

    const { added, replaced } = groupedByNextStateValues(
      leaderDistrictId,
      foundLeaders,
      'leaderDistrictId',
    );

    const addedAndReplaced = [...added, ...replaced];

    const recordsToUpdate: IRepositoryUpdateEntitiesItem<DistrictLeaderEntity>[] =
      [];

    // TODO delete record where "districtId" = null implement on stage of data checking before saving (usersCheckBeforeUpdateService.executeOrFail)

    if (isNonEmptyArray(addedAndReplaced)) {
      const records = addedAndReplaced.map(
        ({ id: userId, leaderDistrictId: districtId }) => ({
          criteria: { userId },
          inputs: { districtId },
        }),
      );
      recordsToUpdate.push(...records);
    }

    return repository.updateEntities(recordsToUpdate);
  }

  private async updateEngineers(
    engineers: UsersUpdateEngineerDTO[],
    foundEngineers: EngineerMemberDTO[],
    repository: EngineersRepository,
  ): Promise<void> {
    const { engineerDistrictId } = groupedByChangedFields(
      engineers,
      foundEngineers,
      ['engineerDistrictId'],
    );

    const { added, deleted } = groupedByNextStateValues(
      engineerDistrictId,
      foundEngineers,
      'engineerDistrictId',
    );

    const recordsToUpdate: IRepositoryUpdateEntitiesItem<EngineerEntity>[] = [];

    if (isNonEmptyArray(added)) {
      const records = added.map(
        ({ id: userId, engineerDistrictId: districtId }) => ({
          criteria: { userId },
          inputs: { districtId },
        }),
      );
      recordsToUpdate.push(...records);
    }

    if (isNonEmptyArray(deleted)) {
      const records = deleted.map(({ id }) => ({
        criteria: { userId: id },
        inputs: { districtId: null },
      }));
      recordsToUpdate.push(...records);
    }

    return repository.updateEntities(recordsToUpdate);
  }
}
