import { Injectable } from '@nestjs/common';
import {
  ClientRepository,
  DistrictRepository,
  UsersRepository,
} from '../../repositories';
import { getUsersWithNotExistsClientsOrDistricts } from '../../helpers';
import {
  IUsersCreateDistrictLeader,
  IUsersCreateEngineer,
  IUsersCreateStationWorker,
} from '../../interfaces';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { ENTITIES_FIELDS } from '@app/entities';
import { AUTH_ERRORS } from '../../../auth/constants';

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
        field: ENTITIES_FIELDS.EMAIL,
        message: AUTH_ERRORS.EMAIL_IS_EXIST,
      })),
    );
  }

  public async checkStationWorkersOrFail(
    stationWorkers: IUsersCreateStationWorker[],
  ): Promise<void> {
    const stationWorkersWithNotExistingClients =
      await getUsersWithNotExistsClientsOrDistricts<IUsersCreateStationWorker>({
        fieldName: ENTITIES_FIELDS.CLIENT_ID,
        users: stationWorkers,
        repository: this.clientRepository,
      });

    const throwError = stationWorkersWithNotExistingClients.length;

    if (throwError) {
      throw new ExceptionsUnprocessableEntity(
        stationWorkersWithNotExistingClients.map(({ clientId }) => ({
          value: clientId,
          field: ENTITIES_FIELDS.CLIENT_ID,
          message: AUTH_ERRORS.CLIENT_NOT_EXIST,
        })),
      );
    }
  }

  public async checkDistrictLeadersOrFail(
    districtLeaders: IUsersCreateDistrictLeader[],
  ): Promise<void> {
    await this.checkClientMembersOrFail(districtLeaders);
    // CHECK IF DISTRICT IS BUSY
    // CHECK OTHER PROPS FOR DISTRICT LEADERS
  }

  public async checkEngineersOrFail(
    engineer: IUsersCreateEngineer[],
  ): Promise<void> {
    await this.checkClientMembersOrFail(engineer);
    // CHECK OTHER PROPS FOR ENGINEER
  }

  private async checkClientMembersOrFail(
    clientMembers: (IUsersCreateEngineer | IUsersCreateDistrictLeader)[],
  ): Promise<void> {
    const clientMembersWithNotExistingClients =
      await getUsersWithNotExistsClientsOrDistricts<
        IUsersCreateEngineer | IUsersCreateDistrictLeader
      >({
        fieldName: ENTITIES_FIELDS.DISTRICT_ID,
        users: clientMembers,
        repository: this.districtRepository,
      });

    const throwError = clientMembersWithNotExistingClients.length;

    if (throwError) {
      throw new ExceptionsUnprocessableEntity(
        clientMembersWithNotExistingClients.map(({ districtId }) => ({
          value: districtId,
          field: ENTITIES_FIELDS.DISTRICT_ID,
          message: AUTH_ERRORS.DISTRICT_NOT_EXIST,
        })),
      );
    }
  }
}
