import { Injectable } from '@nestjs/common';
import {
  UsersClientsRepository,
  UsersDistrictsRepository,
  UsersRepository,
} from '../../repositories';
import { getUsersWithNotExistsClientsOrDistricts } from '../../helpers';
import {
  IClientMemberIdentifyingFields,
  IGetPreparedChildrenErrorsParams,
  IStationWorkerIdentifyingFields,
} from '../../interfaces';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { ENTITIES_FIELDS } from '@app/entities';
import { AUTH_ERRORS } from '../../../auth/constants';
import {
  getPreparingUsersNotEmptyDistricts,
  getPreparingUsersWithDubbedEmail,
} from '../../helpers/users-check-general-data.helpers';
import { IErrorDetailItem } from '@app/exceptions/interfaces';
import { FilteredUserForCheck } from '../../types/users-general.types';

@Injectable()
export class UsersCheckGeneralDataService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersClientsRepository: UsersClientsRepository,
    private readonly usersDistrictsRepository: UsersDistrictsRepository,
  ) {}

  public async checkExistingEmailsOrFail(
    items: { [ENTITIES_FIELDS.EMAIL]: string }[],
  ): Promise<void> {
    const emails = items.map(({ email }) => email);
    const existingUsers = await this.usersRepository.findUsersByEmails(emails);

    if (!existingUsers.length) return;

    const preparedExistingUsers = getPreparingUsersWithDubbedEmail(
      items,
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

  public async checkEmptyDistrictsOrFail(
    items: FilteredUserForCheck<{ [ENTITIES_FIELDS.DISTRICT_ID]: number }>[],
  ): Promise<void> {
    const districtsIds = items.map(({ districtId }) => districtId);
    const emptyDistricts =
      await this.usersDistrictsRepository.findEmptyDistrictsByIds(districtsIds);

    if (emptyDistricts.length === districtsIds.length) return;

    const preparedNotEmptyDistricts = getPreparingUsersNotEmptyDistricts(
      items,
      emptyDistricts,
    );

    const preparedErrors =
      UsersCheckGeneralDataService.getPreparedChildrenErrors(
        preparedNotEmptyDistricts,
        {
          field: ENTITIES_FIELDS.DISTRICT_ID,
          messages: [AUTH_ERRORS.DISTRICT_NOT_EMPTY],
        },
      );
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  public async checkStationWorkersExistingClientsOrFail(
    stationWorkers: FilteredUserForCheck<IStationWorkerIdentifyingFields>[],
  ): Promise<void> {
    const stationWorkersWithNotExistingClients =
      await getUsersWithNotExistsClientsOrDistricts<
        FilteredUserForCheck<IStationWorkerIdentifyingFields>
      >({
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

  public async checkClientMembersExistingDistrictsOrFail(
    clientMembers: FilteredUserForCheck<IClientMemberIdentifyingFields>[],
  ): Promise<void> {
    const clientMembersWithNotExistingDistricts =
      await getUsersWithNotExistsClientsOrDistricts<
        FilteredUserForCheck<IClientMemberIdentifyingFields>
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
