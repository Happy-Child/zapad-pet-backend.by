import { Injectable } from '@nestjs/common';
import {
  ClientRepository,
  DistrictRepository,
  UsersRepository,
} from '../../repositories';
import { getUsersWithNotExistsClientsOrDistricts } from '../../helpers';
import {
  UsersCreateDistrictLeader,
  UsersCreateStationWorker,
  UsersCreateEngineer,
} from '../../interfaces';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/auth/constants';

@Injectable()
export class UsersCheckGeneralDataService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly clientRepository: ClientRepository,
    private readonly districtRepository: DistrictRepository,
  ) {}

  public async checkUsersEmailsOrFail(emails: string[]): Promise<void> {
    const existingUsers = await this.usersRepository.findUsersByEmails(emails);

    if (!existingUsers.length) return;

    throw new ExceptionsUnprocessableEntity(
      existingUsers.map(({ email }) => ({
        value: email,
        field: 'email',
        message: AUTH_ERRORS.EMAIL_IS_EXIST,
      })),
    );
  }

  public async checkStationWorkersOrFail(
    stationWorkers: UsersCreateStationWorker[],
  ): Promise<void> {
    const stationWorkersWithNotExistingClients =
      await getUsersWithNotExistsClientsOrDistricts<UsersCreateStationWorker>({
        fieldName: 'clientId',
        users: stationWorkers,
        repository: this.clientRepository,
      });

    const throwError = stationWorkersWithNotExistingClients.length;

    if (throwError) {
      throw new ExceptionsUnprocessableEntity(
        stationWorkersWithNotExistingClients.map(({ clientId }) => ({
          value: clientId,
          field: 'clientId',
          message: AUTH_ERRORS.CLIENT_NOT_EXIST,
        })),
      );
    }
  }

  public async checkDistrictLeadersOrFail(
    districtLeaders: UsersCreateDistrictLeader[],
  ): Promise<void> {
    await this.checkClientMembersOrFail(districtLeaders);
    // CHECK IF DISTRICT IS BUSY
    // CHECK OTHER PROPS FOR DISTRICT LEADERS
  }

  public async checkEngineersOrFail(
    engineer: UsersCreateEngineer[],
  ): Promise<void> {
    await this.checkClientMembersOrFail(engineer);
    // CHECK OTHER PROPS FOR ENGINEER
  }

  private async checkClientMembersOrFail(
    clientMembers: (UsersCreateEngineer | UsersCreateDistrictLeader)[],
  ): Promise<void> {
    const clientMembersWithNotExistingClients =
      await getUsersWithNotExistsClientsOrDistricts<
        UsersCreateEngineer | UsersCreateDistrictLeader
      >({
        fieldName: 'districtId',
        users: clientMembers,
        repository: this.districtRepository,
      });

    const throwError = clientMembersWithNotExistingClients.length;

    if (throwError) {
      throw new ExceptionsUnprocessableEntity(
        clientMembersWithNotExistingClients.map(({ districtId }) => ({
          value: districtId,
          field: 'districtId',
          message: AUTH_ERRORS.DISTRICT_NOT_EXIST,
        })),
      );
    }
  }
}
