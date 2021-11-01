import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { Connection, EntityManager } from 'typeorm';
import {
  UsersCreateFullDistrictLeaderDTO,
  UsersCreateFullEngineerDTO,
  UsersCreateFullStationWorkerDTO,
  UsersCreateGeneralUserDTO,
  UsersCreateRequestBodyDTO,
} from '../../dtos';
import {
  UsersEmailConfirmedRepository,
  EngineersRepository,
  UsersRepository,
} from '../../repositories';
import { DistrictsLeadersRepository } from '../../../districts-leaders/repositories';
import { StationsWorkersRepository } from '../../../stations-workers/repositories';
import {
  generateRandomToken,
  getIndexedArray,
  isNonEmptyArray,
  toObjectByField,
} from '@app/helpers';
import { getHashByPassword } from '../../../auth/helpers';
import { getGroupedFullUsersByRoles } from '../../helpers';
import { ENTITIES_FIELDS } from '@app/constants';
import {
  DistrictLeaderEntity,
  EmailConfirmedEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import { UsersCheckBeforeCreateService } from './users-check-before-create.service';
import { StationsWorkersCheckBeforeCreateService } from './stations-workers-check-before-create.service';
import { UsersSendingMailService } from '../users-sending-mail.service';
import { UsersGeneralService } from '../users-general.service';

@Injectable()
export class UsersCreateService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersGeneralService: UsersGeneralService,
    private readonly usersCheckBeforeCreateService: UsersCheckBeforeCreateService,
    private readonly stationsWorkersCheckBeforeCreateService: StationsWorkersCheckBeforeCreateService,
    private readonly usersSendingMailService: UsersSendingMailService,
    private readonly connection: Connection,
  ) {}

  public async create({ users }: UsersCreateRequestBodyDTO): Promise<void> {
    const emails = users.map(({ email }) => email) as NonEmptyArray<string>;
    await this.usersGeneralService.allEmailsNotExistingOrFail(emails);

    const preparedUsers = getIndexedArray(users);
    const { stationWorkers, engineers, districtLeaders, simpleUsers } =
      getGroupedFullUsersByRoles<
        UsersCreateFullDistrictLeaderDTO,
        UsersCreateFullEngineerDTO,
        UsersCreateFullStationWorkerDTO,
        UsersCreateGeneralUserDTO
      >(preparedUsers);

    const userCheckingRequestList: Promise<void>[] = [];
    const userCreationRequestList: ((
      manager: EntityManager,
    ) => Promise<UserEntity[]>)[] = [];

    if (isNonEmptyArray(districtLeaders)) {
      userCheckingRequestList.push(
        this.usersCheckBeforeCreateService.checkDistrictLeadersOrFail(
          districtLeaders,
        ),
      );
      userCreationRequestList.push((manager: EntityManager) =>
        this.saveDistrictsLeaders(districtLeaders, manager),
      );
    }

    if (isNonEmptyArray(stationWorkers)) {
      userCheckingRequestList.push(
        this.stationsWorkersCheckBeforeCreateService.execute(stationWorkers),
      );
      userCreationRequestList.push((manager: EntityManager) =>
        this.saveStationWorkers(stationWorkers, manager),
      );
    }

    if (isNonEmptyArray(engineers)) {
      userCheckingRequestList.push(
        this.usersCheckBeforeCreateService.checkEngineersOrFail(engineers),
      );
      userCreationRequestList.push((manager: EntityManager) =>
        this.saveEngineers(engineers, manager),
      );
    }

    if (isNonEmptyArray(simpleUsers)) {
      userCreationRequestList.push((manager: EntityManager) =>
        this.saveSimpleUsers(simpleUsers, manager),
      );
    }

    await Promise.all(userCheckingRequestList);

    await this.connection.transaction(async (manager) => {
      await Promise.all(userCreationRequestList.map((cb) => cb(manager)));

      const allUsers = [
        ...stationWorkers,
        ...engineers,
        ...districtLeaders,
        ...simpleUsers,
      ];

      const records = await this.createRecordsOfConfirmationEmails(
        allUsers,
        manager,
      );

      await this.sendingEmailsCreatedUsers(allUsers, records);
    });
  }

  private async saveDistrictsLeaders(
    districtsLeaders: UsersCreateFullDistrictLeaderDTO[],
    manager: EntityManager,
  ): Promise<UserEntity[]> {
    const createdUsers = await this.saveUsers(districtsLeaders, manager);

    const districtsLeadersRepository = manager.getCustomRepository(
      DistrictsLeadersRepository,
    );
    const records: Partial<DistrictLeaderEntity>[] = districtsLeaders.map(
      ({ leaderDistrictId, email }) => ({
        userId: createdUsers[email].id,
        districtId: leaderDistrictId,
      }),
    );
    await districtsLeadersRepository.saveEntities(records);

    return Object.values(createdUsers);
  }

  private async saveStationWorkers(
    stationWorkers: UsersCreateFullStationWorkerDTO[],
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

  private async saveEngineers(
    engineers: UsersCreateFullEngineerDTO[],
    manager: EntityManager,
  ): Promise<UserEntity[]> {
    const createdUsers = await this.saveUsers(engineers, manager);

    const engineersRepository =
      manager.getCustomRepository(EngineersRepository);
    const records: Partial<EngineerEntity>[] = engineers.map(
      ({ engineerDistrictId, email }) => ({
        userId: createdUsers[email].id,
        districtId: engineerDistrictId,
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

  private async createRecordsOfConfirmationEmails(
    users: { email: string }[],
    manager: EntityManager,
  ): Promise<EmailConfirmedEntity[]> {
    const records = await Promise.all(
      users.map(async ({ email }) => ({
        token: await generateRandomToken(),
        email,
      })),
    );

    const usersEmailConfirmedRepository = manager.getCustomRepository(
      UsersEmailConfirmedRepository,
    );

    return usersEmailConfirmedRepository.saveEntities(records);
  }

  private async sendingEmailsCreatedUsers(
    users: UsersCreateGeneralUserDTO[],
    recordsOfConfirmationEmails: EmailConfirmedEntity[],
  ): Promise<void> {
    const dataToSendingEmails = recordsOfConfirmationEmails.map((record) => {
      const user = users.find(
        ({ email: userEmail }) => userEmail === record.email,
      ) as UsersCreateGeneralUserDTO;
      return { user, token: record.token };
    });

    await Promise.all(
      dataToSendingEmails.map(async ({ token, user }) =>
        this.usersSendingMailService.sendEmailAfterCreatedUser(user, token),
      ),
    );
  }
}
