import { Injectable } from '@nestjs/common';
import {
  UsersDistrictsLeadersRepository,
  UsersRepository,
} from '../../repositories';
import { IGetPreparedChildrenErrorsParams } from '../../interfaces';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '../../../auth/constants';
import { IErrorDetailItem } from '@app/exceptions/interfaces';
import { getItemsByUniqueField } from '@app/helpers';
import { DistrictsRepository } from '../../../districts';
import { ClientsRepository } from '../../../clients';
import { ENTITIES_FIELDS } from '@app/constants';

@Injectable()
export class UsersGeneralCheckService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly districtsRepository: DistrictsRepository,
    private readonly clientsRepository: ClientsRepository,
    private readonly usersDistrictsLeadersRepository: UsersDistrictsLeadersRepository,
  ) {}

  public async checkExistingEmailsOrFail(emails: string[]): Promise<void> {
    const existingUsers = await this.usersRepository.getManyByColumn(
      emails,
      'email',
    );

    if (!existingUsers.length) return;

    const preparedExistingUsers = existingUsers.map((user) => {
      const index = emails.findIndex((email) => email === user.email);
      return { ...user, index };
    });

    const preparedErrors = UsersGeneralCheckService.getPreparedChildrenErrors(
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
    const emptyDistrictsIds =
      await this.usersDistrictsLeadersRepository.getEmptyDistrictsIds(
        districtsIds,
      );

    if (emptyDistrictsIds.length === districtsIds.length) return;

    const itemsWithNotEmptyDistricts = items.filter(
      ({ districtId }) => !emptyDistrictsIds.includes(districtId),
    );

    const preparedErrors = UsersGeneralCheckService.getPreparedChildrenErrors(
      itemsWithNotEmptyDistricts,
      {
        field: ENTITIES_FIELDS.DISTRICT_ID,
        messages: [AUTH_ERRORS.DISTRICT_NOT_EMPTY],
      },
    );
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  public async checkExistingClientsOrFail(
    stationWorkers: { clientId: number; index: number }[],
  ): Promise<void> {
    const stationWorkersWithNotExistingClients =
      await this.getUsersWithNotExistsClientsOrDistricts(
        stationWorkers,
        ENTITIES_FIELDS.CLIENT_ID,
        this.clientsRepository,
      );

    if (stationWorkersWithNotExistingClients.length) {
      const preparedErrors = UsersGeneralCheckService.getPreparedChildrenErrors(
        stationWorkersWithNotExistingClients,
        {
          field: ENTITIES_FIELDS.CLIENT_ID,
          messages: [AUTH_ERRORS.CLIENT_NOT_EXIST],
        },
      );
      throw new ExceptionsUnprocessableEntity(preparedErrors);
    }
  }

  public async checkExistingDistrictsOrFail(
    clientMembers: { districtId: number; index: number }[],
  ): Promise<void> {
    const clientMembersWithNotExistingDistricts =
      await this.getUsersWithNotExistsClientsOrDistricts(
        clientMembers,
        ENTITIES_FIELDS.DISTRICT_ID,
        this.districtsRepository,
      );

    if (clientMembersWithNotExistingDistricts.length) {
      const preparedErrors = UsersGeneralCheckService.getPreparedChildrenErrors(
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
    repository: ClientsRepository | DistrictsRepository,
  ): Promise<T[]> {
    const uniqueIds = getItemsByUniqueField<{
      clientId?: number;
      districtId?: number;
    }>(idFieldName, users);

    const foundEntities = await repository.getManyByColumn(uniqueIds);
    const allIdsExists = foundEntities.length === uniqueIds.length;

    if (allIdsExists) return [];

    const foundEntitiesIds = foundEntities.map(({ id }) => id);

    return users.filter((user) => {
      const entityId = user[idFieldName] as number;
      return !foundEntitiesIds.includes(entityId);
    });
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
