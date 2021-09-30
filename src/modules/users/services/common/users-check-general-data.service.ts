import { Injectable } from '@nestjs/common';
import {
  UsersClientsRepository,
  UsersDistrictsRepository,
  UsersRepository,
} from '../../repositories';
import { IGetPreparedChildrenErrorsParams } from '../../interfaces';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { ENTITIES_FIELDS } from '@app/entities';
import { AUTH_ERRORS } from '../../../auth/constants';
import {
  getPreparingUsersNotEmptyDistricts,
  getPreparingUsersWithDubbedEmail,
} from '../../helpers/users-check-general-data.helpers';
import { IErrorDetailItem } from '@app/exceptions/interfaces';
import { getItemsByUniqueField } from '@app/helpers';

@Injectable()
export class UsersCheckGeneralDataService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersClientsRepository: UsersClientsRepository,
    private readonly usersDistrictsRepository: UsersDistrictsRepository,
  ) {}

  public async checkExistingEmailsOrFail(
    items: { email: string }[],
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
    items: { index: number; districtId: number }[],
  ): Promise<void> {
    const districtsIds = items.map(({ districtId }) => districtId);
    const foundDistricts =
      await this.usersDistrictsRepository.findEmptyDistrictsByIds(districtsIds);

    if (foundDistricts.length === districtsIds.length) return;

    const preparedNotEmptyDistricts = getPreparingUsersNotEmptyDistricts(
      items,
      foundDistricts,
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

  public async checkExistingClientsInArrayOrFail(
    stationWorkers: { clientId: number; index: number }[],
  ): Promise<void> {
    const stationWorkersWithNotExistingClients =
      await this.getUsersWithNotExistsClientsOrDistricts(
        stationWorkers,
        ENTITIES_FIELDS.CLIENT_ID,
        this.usersClientsRepository,
      );

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

  public async checkExistingDistrictsInArrayOrFail(
    clientMembers: { districtId: number; index: number }[],
  ): Promise<void> {
    const clientMembersWithNotExistingDistricts =
      await this.getUsersWithNotExistsClientsOrDistricts(
        clientMembers,
        ENTITIES_FIELDS.DISTRICT_ID,
        this.usersDistrictsRepository,
      );

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

  private async getUsersWithNotExistsClientsOrDistricts<
    T extends {
      clientId?: number;
      districtId?: number;
    },
  >(
    users: T[],
    idFieldName: ENTITIES_FIELDS.DISTRICT_ID | ENTITIES_FIELDS.CLIENT_ID,
    repository: UsersClientsRepository | UsersDistrictsRepository,
  ): Promise<T[]> {
    const uniqueIds = getItemsByUniqueField<{
      clientId?: number;
      districtId?: number;
    }>(idFieldName, users);

    const foundEntities = await repository.getManyByIds(uniqueIds);
    const allIdsExists = foundEntities.length === uniqueIds.length;

    if (allIdsExists) return [];

    const foundEntitiesIds = foundEntities.map(({ id }) => id);

    const usersWithNotExistingEntityIds = users.filter((user) => {
      const entityId = user[idFieldName] as number;
      const entityExist = foundEntitiesIds.includes(entityId);
      return !entityExist;
    });

    return usersWithNotExistingEntityIds;
  }

  private static getPreparedChildrenErrors(
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
