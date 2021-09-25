import { Injectable } from '@nestjs/common';
import {
  UsersClientsRepository,
  UsersDistrictsRepository,
  UsersRepository,
} from '../../repositories';
import { getUsersWithNotExistsClientsOrDistricts } from '../../helpers';
import {
  IGetPreparedChildrenErrorsParams,
  IUsersCreateDistrictLeader,
  IUsersCreateEngineer,
  IUsersCreateStationWorker,
} from '../../interfaces';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { ENTITIES_FIELDS, UserEntity } from '@app/entities';
import { AUTH_ERRORS } from '../../../auth/constants';
import { getPreparingUsersWithDubbedEmail } from '../../helpers/users-check-general-data.helpers';
import { IErrorDetailItem } from '../../../../../libs/exceptions/src/interfaces';

@Injectable()
export class UsersCheckGeneralDataService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersClientsRepository: UsersClientsRepository,
    private readonly usersDistrictsRepository: UsersDistrictsRepository,
  ) {}

  public async checkExistingEmailsOrFail(
    users: Pick<UserEntity, 'email'>[],
  ): Promise<void> {
    const emails = users.map(({ email }) => email);
    const existingUsers = await this.usersRepository.findUsersByEmails(emails);

    if (!existingUsers.length) return;

    const preparedExistingUsers = getPreparingUsersWithDubbedEmail(
      users,
      existingUsers,
    );

    const preparedErrors =
      UsersCheckGeneralDataService.getPreparedChildrenErrors(
        preparedExistingUsers,
        {
          field: ENTITIES_FIELDS.EMAIL,
          messages: [AUTH_ERRORS.EMAIL_IS_EXIST],
        },
      );
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  public async checkStationWorkersOrFail(
    stationWorkers: IUsersCreateStationWorker[],
  ): Promise<void> {
    const stationWorkersWithNotExistingClients =
      await getUsersWithNotExistsClientsOrDistricts<IUsersCreateStationWorker>({
        fieldName: ENTITIES_FIELDS.CLIENT_ID,
        users: stationWorkers,
        repository: this.usersClientsRepository,
      });

    if (stationWorkersWithNotExistingClients.length) {
      const preparedErrors =
        UsersCheckGeneralDataService.getPreparedChildrenErrors(
          stationWorkersWithNotExistingClients,
          {
            field: ENTITIES_FIELDS.CLIENT_ID,
            messages: [AUTH_ERRORS.CLIENT_NOT_EXIST],
          },
        );
      throw new ExceptionsUnprocessableEntity(preparedErrors);
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
    const clientMembersWithNotExistingDistricts =
      await getUsersWithNotExistsClientsOrDistricts<
        IUsersCreateEngineer | IUsersCreateDistrictLeader
      >({
        fieldName: ENTITIES_FIELDS.DISTRICT_ID,
        users: clientMembers,
        repository: this.usersDistrictsRepository,
      });

    if (clientMembersWithNotExistingDistricts.length) {
      const preparedErrors =
        UsersCheckGeneralDataService.getPreparedChildrenErrors(
          clientMembersWithNotExistingDistricts,
          {
            field: ENTITIES_FIELDS.DISTRICT_ID,
            messages: [AUTH_ERRORS.DISTRICT_NOT_EXIST],
          },
        );
      throw new ExceptionsUnprocessableEntity(preparedErrors);
    }
  }

  public static getPreparedChildrenErrors(
    list: { index: number }[],
    params: IGetPreparedChildrenErrorsParams,
  ): IErrorDetailItem[] {
    const children = list.map(({ index }) => ({
      field: index,
      children: [
        {
          field: params.field,
          messages: params.messages,
        },
      ],
    }));

    return [
      {
        field: ENTITIES_FIELDS.USERS,
        children,
      },
    ];
  }
}
