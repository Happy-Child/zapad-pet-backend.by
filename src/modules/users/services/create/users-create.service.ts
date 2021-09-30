import { Injectable } from '@nestjs/common';
import {
  UsersCreateAccountantDTO,
  UsersCreateDistrictLeaderDTO,
  UsersCreateEngineerDTO,
  UsersCreateGeneralUserDTO,
  UsersCreateRequestBodyDTO,
  UsersCreateStationWorkerDTO,
} from '../../dtos';
import { UsersCheckBeforeCreateService } from './users-check-before-create.service';
import { UsersCheckGeneralDataService } from '../common';
import { UsersDistrictsRepository, UsersRepository } from '../../repositories';
import { Connection, EntityManager } from 'typeorm';
import { ClientsToStationWorkersRepository } from '../../../clients';
import { toObjectByField } from '@app/helpers';
import { UserEntity } from '../../entities';
import { DistrictEntity, ENTITIES_FIELDS } from '@app/entities';
import { DistrictsToEngineersRepository } from '../../../districts';
import { getHashByPassword } from '../../../auth/helpers';
import { UsersSendingMailService } from '../users-sending-mail.service';
import { getGroupedUsersByRoles } from '../../helpers';
import { IRepositoryUpdateEntitiesItem } from '@app/repositories/interfaces';

@Injectable()
export class UsersCreateService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly checkGeneralUsersDataService: UsersCheckGeneralDataService,
    private readonly usersCheckBeforeCreateService: UsersCheckBeforeCreateService,
    private readonly usersSendingMailService: UsersSendingMailService,
    private readonly connection: Connection,
  ) {}

  public async create({ users }: UsersCreateRequestBodyDTO) {
    await this.checkGeneralUsersDataService.checkExistingEmailsOrFail(users);

    const { stationWorkers, engineers, districtLeaders, accountants } =
      getGroupedUsersByRoles<
        UsersCreateDistrictLeaderDTO,
        UsersCreateEngineerDTO,
        UsersCreateStationWorkerDTO,
        UsersCreateAccountantDTO
      >(users);

    const userCheckingRequestList: Promise<void>[] = [];
    const userCreationRequestList: ((
      manager: EntityManager,
    ) => Promise<UserEntity[]>)[] = [];

    if (districtLeaders.length) {
      userCheckingRequestList.push(
        this.usersCheckBeforeCreateService.checkDistrictLeadersOrFail(
          districtLeaders,
        ),
      );
      userCreationRequestList.push((manager: EntityManager) =>
        this.saveDistrictsLeaders(districtLeaders, manager),
      );
    }

    if (stationWorkers.length) {
      userCheckingRequestList.push(
        this.usersCheckBeforeCreateService.checkStationWorkersOrFail(
          stationWorkers,
        ),
      );
      userCreationRequestList.push((manager: EntityManager) =>
        this.saveStationWorkers(stationWorkers, manager),
      );
    }

    if (engineers.length) {
      userCheckingRequestList.push(
        this.usersCheckBeforeCreateService.checkEngineersOrFail(engineers),
      );
      userCreationRequestList.push((manager: EntityManager) =>
        this.saveEngineers(engineers, manager),
      );
    }

    if (accountants.length) {
      userCreationRequestList.push((manager: EntityManager) =>
        this.saveAccountants(accountants, manager),
      );
    }

    await Promise.all(userCheckingRequestList);

    await this.connection.transaction(async (manager) => {
      const userCreationResult = await Promise.all(
        userCreationRequestList.map((cb) => cb(manager)),
      );
      const createdUsers = userCreationResult.flat(1);
      // 1. создать записи на подтверждение почты
      // 2. отправить письма по токенам из <1>
      // МОЖНО ДЕКОМПОЗИРОВАТЬ ???
    });
  }

  private async saveDistrictsLeaders(
    districtsLeaders: UsersCreateDistrictLeaderDTO[],
    manager: EntityManager,
  ): Promise<UserEntity[]> {
    const createdUsers = await this.saveUsers(districtsLeaders, manager);

    const usersDistrictsRepository = manager.getCustomRepository(
      UsersDistrictsRepository,
    );
    const districtsToUpdate: IRepositoryUpdateEntitiesItem<DistrictEntity>[] =
      districtsLeaders.map(({ districtId: id, email }) => ({
        criteria: { id },
        inputs: { districtLeaderId: createdUsers[email].id },
      }));
    await usersDistrictsRepository.updateEntities(districtsToUpdate);

    return Object.values(createdUsers);
  }

  private async saveStationWorkers(
    stationWorkers: UsersCreateStationWorkerDTO[],
    manager: EntityManager,
  ): Promise<UserEntity[]> {
    const createdUsers = await this.saveUsers(stationWorkers, manager);

    const usersClientsRepository = manager.getCustomRepository(
      ClientsToStationWorkersRepository,
    );
    const clientsToStationWorkersEntities = stationWorkers.map(
      ({ email, clientId }) => ({
        clientId,
        stationWorkerId: createdUsers[email].id,
      }),
    );
    await usersClientsRepository.saveEntities(clientsToStationWorkersEntities);

    return Object.values(createdUsers);
  }

  private async saveEngineers(
    engineers: UsersCreateEngineerDTO[],
    manager: EntityManager,
  ): Promise<UserEntity[]> {
    const createdUsers = await this.saveUsers(engineers, manager);

    const districtsToEngineersRepository = manager.getCustomRepository(
      DistrictsToEngineersRepository,
    );
    const districtsToEngineersEntities = engineers.map(
      ({ email, districtId }) => ({
        districtId,
        engineerId: createdUsers[email].id,
      }),
    );
    await districtsToEngineersRepository.saveEntities(
      districtsToEngineersEntities,
    );

    return Object.values(createdUsers);
  }

  private async saveAccountants(
    users: UsersCreateAccountantDTO[],
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

    return toObjectByField<UserEntity>(ENTITIES_FIELDS.EMAIL, createdUsers);
  }
}
