import { Injectable } from '@nestjs/common';
import { UserRepository } from '@app/repositories';
import { UnprocessableEntity } from '@app/exceptions';
import { USERS_ERRORS } from '../../constants/errors.constants';
import { ClientRepository } from '../../repositories/client.repository';
import { DistrictRepository } from '../../repositories/district.repository';
import { getUsersWithNotExistsClientsOrDistricts } from '../../helpers/common.helpers';
import {
  UsersCreateDistrictLeader,
  UsersCreateStationWorker,
  UsersCreateEngineer,
} from '../../interfaces/create.interfaces';

@Injectable()
export class CheckGeneralUsersDataService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
    private readonly districtRepository: DistrictRepository,
  ) {}

  public async checkUsersEmailsOrFail(emails: string[]): Promise<void> {
    const existingUsers = await this.userRepository.findUsersByEmails(emails);

    if (!existingUsers.length) return;

    throw new UnprocessableEntity(
      existingUsers.map(({ email }) => ({
        value: email,
        field: 'email',
        message: USERS_ERRORS.EMAIL_IS_EXIST,
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

    const throwError =
      stationWorkersWithNotExistingClients instanceof Array &&
      stationWorkersWithNotExistingClients.length;

    if (throwError) {
      throw new UnprocessableEntity(
        stationWorkersWithNotExistingClients.map(({ clientId }) => ({
          value: clientId,
          field: 'clientId',
          message: USERS_ERRORS.CLIENT_NOT_EXIST,
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

    const throwError =
      clientMembersWithNotExistingClients instanceof Array &&
      clientMembersWithNotExistingClients.length;

    if (throwError) {
      throw new UnprocessableEntity(
        clientMembersWithNotExistingClients.map(({ districtId }) => ({
          value: districtId,
          field: 'districtId',
          message: USERS_ERRORS.DISTRICT_NOT_EXIST,
        })),
      );
    }
  }
}
