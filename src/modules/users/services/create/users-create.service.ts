import { Injectable } from '@nestjs/common';
import { UsersCreateRequestBodyDTO } from '../../dtos';
import { UsersCheckBeforeCreateService } from './users-check-before-create.service';
import { UsersCheckGeneralDataService } from '../common';
import { getFilteredUsersToCreate } from '../../helpers';
import {
  IUsersCreateDistrictLeader,
  IUsersCreateEngineer,
  IUsersCreateSimpleUser,
  IUsersCreateStationWorker,
} from '../../interfaces';
import { UsersDistrictsRepository, UsersRepository } from '../../repositories';
import { Connection, EntityManager } from 'typeorm';
import { ClientsToStationWorkersRepository } from '../../../clients';
import { groupedBy } from '@app/helpers';
import { UserEntity } from '../../entities';
import {
  DistrictEntity,
  ENTITIES_FIELDS,
} from '@app/entities';
import { DistrictsToEngineersRepository } from '../../../districts';
import { getHashByPassword } from '../../../auth/helpers';
import { IUpdateEntitiesItem } from '@app/repositories/interfaces';

@Injectable()
export class UsersCreateService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly checkGeneralUsersDataService: UsersCheckGeneralDataService,
    private readonly usersCheckBeforeCreateService: UsersCheckBeforeCreateService,
    private readonly connection: Connection,
  ) {}

  async create({ users }: UsersCreateRequestBodyDTO) {
    await this.checkGeneralUsersDataService.checkExistingEmailsOrFail(users);

    const { stationWorkers, engineers, districtLeaders, simples } =
      getFilteredUsersToCreate(users);

    const listOfCheckingUsers = [];
    const listOfCreationUsers: ((manager: EntityManager) => Promise<void>)[] =
      [];

    if (districtLeaders.length) {
      listOfCheckingUsers.push(
        this.usersCheckBeforeCreateService.checkDistrictLeadersOrFail(
          districtLeaders,
        ),
      );
      listOfCreationUsers.push((manager: EntityManager) =>
        this.saveDistrictsLeaders(districtLeaders, manager),
      );
    }

    if (stationWorkers.length) {
      listOfCheckingUsers.push(
        this.usersCheckBeforeCreateService.checkStationWorkersOrFail(
          stationWorkers,
        ),
      );
      listOfCreationUsers.push((manager: EntityManager) =>
        this.saveStationWorkers(stationWorkers, manager),
      );
    }

    if (engineers.length) {
      listOfCheckingUsers.push(
        this.usersCheckBeforeCreateService.checkEngineersOrFail(engineers),
      );
      listOfCreationUsers.push((manager: EntityManager) =>
        this.saveEngineers(engineers, manager),
      );
    }

    if (simples.length) {
      listOfCreationUsers.push((manager: EntityManager) =>
        this.saveSimples(simples, manager),
      );
    }

    await Promise.all(listOfCheckingUsers);

    await this.connection.transaction(async (manager) => {
      await Promise.all(listOfCreationUsers.map((cb) => cb(manager)));
    });
  }

  private async saveDistrictsLeaders(
    districtsLeaders: IUsersCreateDistrictLeader[],
    manager: EntityManager,
  ): Promise<void> {
    const groupedCreatedUsersByEmail = await this.saveUsersAndGetGrouped(
      districtsLeaders,
      manager,
    );

    const usersDistrictsRepository = manager.getCustomRepository(
      UsersDistrictsRepository,
    );
    const districtsToUpdate: IUpdateEntitiesItem<DistrictEntity>[] =
      districtsLeaders.map(({ districtId: id, email }) => ({
        criteria: { id },
        inputs: { districtLeaderId: groupedCreatedUsersByEmail[email].id },
      }));
    await usersDistrictsRepository.updateEntities(districtsToUpdate);
  }

  private async saveStationWorkers(
    stationWorkers: IUsersCreateStationWorker[],
    manager: EntityManager,
  ): Promise<void> {
    const groupedCreatedUsersByEmail = await this.saveUsersAndGetGrouped(
      stationWorkers,
      manager,
    );

    const usersClientsRepository = manager.getCustomRepository(
      ClientsToStationWorkersRepository,
    );
    const clientsToStationWorkersEntities = stationWorkers.map(
      ({ email, clientId }) => ({
        clientId,
        stationWorkerId: groupedCreatedUsersByEmail[email].id,
      }),
    );
    await usersClientsRepository.saveEntities(clientsToStationWorkersEntities);
  }

  private async saveEngineers(
    engineers: IUsersCreateEngineer[],
    manager: EntityManager,
  ): Promise<void> {
    const groupedCreatedUsersByEmail = await this.saveUsersAndGetGrouped(
      engineers,
      manager,
    );

    const districtsToEngineersRepository = manager.getCustomRepository(
      DistrictsToEngineersRepository,
    );
    const districtsToEngineersEntities = engineers.map(
      ({ email, districtId }) => ({
        districtId,
        engineerId: groupedCreatedUsersByEmail[email].id,
      }),
    );
    await districtsToEngineersRepository.saveEntities(
      districtsToEngineersEntities,
    );
  }

  private async saveSimples(
    users: IUsersCreateSimpleUser[],
    manager: EntityManager,
  ): Promise<void> {
    await this.saveUsersAndGetGrouped(users, manager);
  }

  private async saveUsersAndGetGrouped(
    users: IUsersCreateSimpleUser[],
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
    const createdUsers = await usersRepository.saveEntities(usersToSave);
    return groupedBy<UserEntity>(ENTITIES_FIELDS.EMAIL, createdUsers);
  }
}
