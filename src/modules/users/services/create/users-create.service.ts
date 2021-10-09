import { Injectable } from '@nestjs/common';
import {
  UsersCreateDistrictLeaderDTO,
  UsersCreateEngineerDTO,
  UsersCreateGeneralUserDTO,
  UsersCreateRequestBodyDTO,
  UsersCreateStationWorkerDTO,
} from '../../dtos';
import { UsersCheckBeforeCreateService } from './users-check-before-create.service';
import { UsersGeneralCheckService } from '../general';
import {
  UsersDistrictsLeadersRepository,
  UsersEmailConfirmedRepository,
  UsersEngineersRepository,
  UsersRepository,
  UsersStationsWorkersRepository,
} from '../../repositories';
import { Connection, EntityManager } from 'typeorm';
import { generateRandomToken, toObjectByField } from '@app/helpers';
import { getHashByPassword } from '../../../auth/helpers';
import { UsersSendingMailService } from '../users-sending-mail.service';
import { getGroupedFullUsersByRoles } from '../../helpers';
import { ENTITIES_FIELDS } from '@app/constants';
import {
  DistrictLeaderEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '../../entities';
import { EmailConfirmedEntity } from '../../../auth/entities';

@Injectable()
export class UsersCreateService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly checkGeneralUsersDataService: UsersGeneralCheckService,
    private readonly usersCheckBeforeCreateService: UsersCheckBeforeCreateService,
    private readonly usersSendingMailService: UsersSendingMailService,
    private readonly connection: Connection,
  ) {}

  public async create({ users }: UsersCreateRequestBodyDTO) {
    const emails = users.map(({ email }) => email);
    await this.checkGeneralUsersDataService.checkExistingEmailsOrFail(emails);

    const { stationWorkers, engineers, districtLeaders, simpleUsers } =
      getGroupedFullUsersByRoles<
        UsersCreateDistrictLeaderDTO,
        UsersCreateEngineerDTO,
        UsersCreateStationWorkerDTO,
        UsersCreateGeneralUserDTO
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

    if (simpleUsers.length) {
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
    districtsLeaders: UsersCreateDistrictLeaderDTO[],
    manager: EntityManager,
  ): Promise<UserEntity[]> {
    const createdUsers = await this.saveUsers(districtsLeaders, manager);

    const districtsLeadersRepository = manager.getCustomRepository(
      UsersDistrictsLeadersRepository,
    );
    const records: Partial<DistrictLeaderEntity>[] = districtsLeaders.map(
      ({ districtId, email }) => ({
        userId: createdUsers[email].id,
        districtId,
      }),
    );
    await districtsLeadersRepository.saveEntities(records);

    return Object.values(createdUsers);
  }

  private async saveStationWorkers(
    stationWorkers: UsersCreateStationWorkerDTO[],
    manager: EntityManager,
  ): Promise<UserEntity[]> {
    const createdUsers = await this.saveUsers(stationWorkers, manager);

    const stationsWorkersRepository = manager.getCustomRepository(
      UsersStationsWorkersRepository,
    );
    const records: Partial<StationWorkerEntity>[] = stationWorkers.map(
      ({ clientId, email }) => ({
        userId: createdUsers[email].id,
        clientId,
      }),
    );
    await stationsWorkersRepository.saveEntities(records);

    return Object.values(createdUsers);
  }

  private async saveEngineers(
    engineers: UsersCreateEngineerDTO[],
    manager: EntityManager,
  ): Promise<UserEntity[]> {
    const createdUsers = await this.saveUsers(engineers, manager);

    const engineersRepository = manager.getCustomRepository(
      UsersEngineersRepository,
    );
    const records: Partial<EngineerEntity>[] = engineers.map(
      ({ districtId, email }) => ({
        userId: createdUsers[email].id,
        districtId,
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
