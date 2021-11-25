import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { Connection, EntityManager } from 'typeorm';
import {
  UsersCreateDistrictLeaderDTO,
  UsersCreateEngineerDTO,
  UsersCreateFullDistrictLeaderDTO,
  UsersCreateFullEngineerDTO,
  UsersCreateFullStationWorkerDTO,
  UsersCreateGeneralUserDTO,
  UsersCreateItemDTO,
  UsersCreateRequestBodyDTO,
  UsersCreateStationWorkerDTO,
} from '../dtos';
import {
  UsersEmailConfirmedRepository,
  UsersRepository,
} from '../repositories';
import { DistrictsLeadersRepository } from '../../districts-leaders/repositories';
import { StationsWorkersRepository } from '../../stations-workers/repositories';
import {
  getIndexedArray,
  isNonEmptyArray,
  toObjectByField,
} from '@app/helpers';
import { getHashByPassword } from '../../auth/helpers';
import { getGroupedFullUsersByRoles } from '../helpers';
import { ENTITIES_FIELDS, USER_ROLES } from '@app/constants';
import {
  DistrictLeaderEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import { StationsWorkersCheckBeforeCreateService } from '../../stations-workers/services';
import { UsersSendingMailService } from './users-sending-mail.service';
import { UsersGeneralService } from './users-general.service';
import { groupedByRoles } from '@app/helpers/grouped.helpers';
import { EngineersRepository } from '../../engineers/repositories';
import { EngineersCheckBeforeCreateService } from '../../engineers/services';
import { DistrictsLeadersCheckBeforeCreateService } from '../../districts-leaders/services';

@Injectable()
export class UsersCreateService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersGeneralService: UsersGeneralService,
    private readonly engineersCheckBeforeCreateService: EngineersCheckBeforeCreateService,
    private readonly districtsLeadersCheckBeforeCreateService: DistrictsLeadersCheckBeforeCreateService,
    private readonly stationsWorkersCheckBeforeCreateService: StationsWorkersCheckBeforeCreateService,
    private readonly usersSendingMailService: UsersSendingMailService,
    private readonly connection: Connection,
  ) {}

  public async execute({ users }: UsersCreateRequestBodyDTO): Promise<void> {
    const indexedUsers = getIndexedArray(users);
    await this.usersGeneralService.allEmailsNotExistingOrFail(indexedUsers);

    const requestsToCheckingMembers =
      this.getRequestsToCheckingMembers(indexedUsers);
    await Promise.all(requestsToCheckingMembers);

    await this.connection.transaction(async (manager) => {
      const requestsToCreationUsers =
        this.getRequestsToCreationUsers(indexedUsers);
      await Promise.all(requestsToCreationUsers.map((cb) => cb(manager)));

      await this.usersSendingMailService.sendingEmailsCreatedUsers(
        users,
        manager.getCustomRepository(UsersEmailConfirmedRepository),
      );
    });
  }

  private getRequestsToCheckingMembers(
    users: NonEmptyArray<UsersCreateItemDTO & { index: number }>,
  ): Promise<void>[] {
    const fullMembers = getGroupedFullUsersByRoles<
      UsersCreateFullDistrictLeaderDTO,
      UsersCreateFullEngineerDTO,
      UsersCreateFullStationWorkerDTO,
      UsersCreateGeneralUserDTO
    >(users);

    const requestsToCheckingMembers: Promise<void>[] = [];

    if (isNonEmptyArray(fullMembers.districtLeaders)) {
      requestsToCheckingMembers.push(
        this.districtsLeadersCheckBeforeCreateService.executeOrFail(
          fullMembers.districtLeaders,
        ),
      );
    }

    if (isNonEmptyArray(fullMembers.stationWorkers)) {
      requestsToCheckingMembers.push(
        this.stationsWorkersCheckBeforeCreateService.executeOrFail(
          fullMembers.stationWorkers,
        ),
      );
    }

    if (isNonEmptyArray(fullMembers.engineers)) {
      requestsToCheckingMembers.push(
        this.engineersCheckBeforeCreateService.executeOrFail(
          fullMembers.engineers,
        ),
      );
    }

    return requestsToCheckingMembers;
  }

  private getRequestsToCreationUsers(
    users: NonEmptyArray<UsersCreateItemDTO & { index: number }>,
  ): ((manager: EntityManager) => Promise<UserEntity[]>)[] {
    const groupedUsersByRoles = groupedByRoles<
      UsersCreateStationWorkerDTO,
      UsersCreateDistrictLeaderDTO,
      UsersCreateEngineerDTO,
      Omit<UsersCreateGeneralUserDTO, 'role'> & { role: USER_ROLES.ACCOUNTANT }
    >(users);

    const requestsToCreationUsers: ((
      manager: EntityManager,
    ) => Promise<UserEntity[]>)[] = [];

    if (isNonEmptyArray(groupedUsersByRoles.stationsWorkers)) {
      const request = (manager: EntityManager) =>
        this.saveStationWorkers(groupedUsersByRoles.stationsWorkers, manager);
      requestsToCreationUsers.push(request);
    }

    if (isNonEmptyArray(groupedUsersByRoles.districtsLeaders)) {
      const request = (manager: EntityManager) =>
        this.saveDistrictsLeaders(
          groupedUsersByRoles.districtsLeaders,
          manager,
        );
      requestsToCreationUsers.push(request);
    }

    if (isNonEmptyArray(groupedUsersByRoles.engineers)) {
      const request = (manager: EntityManager) =>
        this.saveEngineers(groupedUsersByRoles.engineers, manager);
      requestsToCreationUsers.push(request);
    }

    if (isNonEmptyArray(groupedUsersByRoles.accountants)) {
      const request = (manager: EntityManager) =>
        this.saveSimpleUsers(groupedUsersByRoles.accountants, manager);
      requestsToCreationUsers.push(request);
    }

    return requestsToCreationUsers;
  }

  private async saveStationWorkers(
    stationWorkers: UsersCreateStationWorkerDTO[],
    manager: EntityManager,
  ): Promise<UserEntity[]> {
    const createdUsers = await this.saveUsers(stationWorkers, manager);

    const stationsWorkersRepository = manager.getCustomRepository(
      StationsWorkersRepository,
    );
    const records: Partial<StationWorkerEntity>[] = stationWorkers.map(
      ({ clientId, stationId, email }) => ({
        userId: createdUsers[email].id,
        clientId,
        stationId,
      }),
    );
    await stationsWorkersRepository.saveEntities(records);

    return Object.values(createdUsers);
  }

  private async saveDistrictsLeaders(
    districtsLeaders: UsersCreateDistrictLeaderDTO[],
    manager: EntityManager,
  ): Promise<UserEntity[]> {
    const createdUsers = await this.saveUsers(districtsLeaders, manager);

    const districtsLeadersRepository = manager.getCustomRepository(
      DistrictsLeadersRepository,
    );
    const records: Partial<DistrictLeaderEntity>[] = districtsLeaders.map(
      ({ leaderDistrictId, email }) => ({
        userId: createdUsers[email].id,
        leaderDistrictId,
      }),
    );
    await districtsLeadersRepository.saveEntities(records);

    return Object.values(createdUsers);
  }

  private async saveEngineers(
    engineers: UsersCreateEngineerDTO[],
    manager: EntityManager,
  ): Promise<UserEntity[]> {
    const createdUsers = await this.saveUsers(engineers, manager);

    const engineersRepository =
      manager.getCustomRepository(EngineersRepository);
    const records: Partial<EngineerEntity>[] = engineers.map(
      ({ engineerDistrictId, email }) => ({
        userId: createdUsers[email].id,
        engineerDistrictId,
      }),
    );
    await engineersRepository.saveEntities(records);

    return Object.values(createdUsers);
  }

  private async saveSimpleUsers(
    users: UsersCreateGeneralUserDTO[],
    manager: EntityManager,
  ): Promise<UserEntity[]> {
    const data = await this.saveUsers(users, manager);
    return Object.values(data);
  }

  private async saveUsers(
    users: UsersCreateGeneralUserDTO[],
    manager: EntityManager,
  ): Promise<Record<string, UserEntity>> {
    const usersRepository = manager.getCustomRepository(UsersRepository);
    const usersToSave = await Promise.all(
      users.map(async ({ name, email, role, password }) => ({
        name,
        email,
        role,
        password: await getHashByPassword(password),
      })),
    );

    let createdUsers = await usersRepository.saveEntities(usersToSave);
    createdUsers = usersRepository.serializeMany(createdUsers);

    return toObjectByField(ENTITIES_FIELDS.EMAIL, createdUsers);
  }
}
