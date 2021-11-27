import { Injectable } from '@nestjs/common';
import { StationsRepository } from '../../stations/repositories';
import { StationsWorkersRepository } from '../../stations-workers/repositories';
import { NonEmptyArray } from '@app/types';
import { getItemsByUniqueField } from '@app/helpers';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ENTITIES_FIELDS } from '@app/constants';
import { AUTH_ERRORS } from '../../auth/constants';
import {
  ExceptionsNotFound,
  ExceptionsUnprocessableEntity,
} from '@app/exceptions/errors';
import { ClientsRepository } from '../../clients/repositories';
import { StationExtendedDTO } from '../../stations/dtos';
import { STATIONS_ERRORS } from '../../stations/constants';
import { StationWorkerEntity, UserEntity } from '@app/entities';
import { DistrictsRepository } from '../../districts/repositories';
import { TUserDTO } from '../../users/types';
import { USERS_ERRORS, USERS_MEMBER_RAW_SELECT } from '../../users/constants';
import { UsersRepository } from '../../users/repositories';
import { RepositoryFindConditions } from '@app/repositories/types';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { getSerializedMemberUser, isDistrictLeader } from '../../users/helpers';
import { DistrictLeaderMemberDTO } from '../../districts-leaders/dtos';

@Injectable()
export class EntityFinderGeneralService {
  constructor(
    private readonly districtsRepository: DistrictsRepository,
    private readonly clientsRepository: ClientsRepository,
    private readonly stationsRepository: StationsRepository,
    private readonly stationsWorkersRepository: StationsWorkersRepository,
    private readonly usersRepository: UsersRepository,
  ) {}

  public async allClientsExistsOrFail(
    items: NonEmptyArray<{ clientId: number; index: number }>,
  ): Promise<void> {
    const uniqueIds = getItemsByUniqueField<{ clientId: number }>(
      'clientId',
      items,
    );

    const foundEntities = await this.clientsRepository.getManyByColumn(
      uniqueIds,
    );
    const allIdsExists = foundEntities.length === uniqueIds.length;

    if (allIdsExists) return;

    const foundEntitiesIds = foundEntities.map(({ id }) => id);
    const result = items.filter(
      (item) => !foundEntitiesIds.includes(item.clientId),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: ENTITIES_FIELDS.CLIENT_ID,
      messages: [AUTH_ERRORS.CLIENT_NOT_EXIST],
    });
    throw new ExceptionsNotFound(preparedErrors);
  }

  public async allStationsExistsOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
    exceptionByField = 'id',
  ): Promise<NonEmptyArray<StationExtendedDTO>> {
    const ids = items.map(({ id }) => id) as NonEmptyArray<number>;

    const foundRecords = await this.stationsRepository.getStationsByIds(ids);

    const allIdsExisting = ids.length === foundRecords.length;

    if (allIdsExisting) {
      return foundRecords as NonEmptyArray<StationExtendedDTO>;
    }

    const recordsIds = foundRecords.map(({ id }) => id);
    const result = items.filter((item) => !recordsIds.includes(item.id));

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: exceptionByField,
      messages: [STATIONS_ERRORS.STATION_NOT_FOUND],
    });
    throw new ExceptionsNotFound(preparedErrors);
  }

  public async allWorkersExistingOrFail(
    workers: NonEmptyArray<{ stationWorkerId: number; index: number }>,
    exceptionField = 'stationWorkerId',
  ): Promise<NonEmptyArray<StationWorkerEntity>> {
    const workersIds = workers.map(
      ({ stationWorkerId }) => stationWorkerId,
    ) as NonEmptyArray<number>;

    const foundRecords = await this.stationsWorkersRepository.getManyByColumn(
      workersIds,
      'userId',
    );

    const allIdsExisting = workersIds.length === foundRecords.length;

    if (!allIdsExisting) {
      const recordsIds = foundRecords.map(({ userId }) => userId);
      const result = workers.filter(
        (item) => !recordsIds.includes(item.stationWorkerId),
      );

      const preparedErrors = getPreparedChildrenErrors(result, {
        field: exceptionField,
        messages: [STATIONS_ERRORS.STATION_WORKER_NOT_EXIST],
      });
      throw new ExceptionsNotFound(preparedErrors);
    }

    return foundRecords as NonEmptyArray<StationWorkerEntity>;
  }

  public async allDistrictsExistsOrFail(
    items: NonEmptyArray<{ districtId: number; index: number }>,
    exceptionField = 'leaderDistrictId',
  ): Promise<void> {
    const uniqueIds = getItemsByUniqueField<{ districtId: number }>(
      'districtId',
      items,
    );

    const foundEntities = await this.districtsRepository.getManyByColumn(
      uniqueIds,
    );
    const allIdsExists = foundEntities.length === uniqueIds.length;

    if (allIdsExists) return;

    const foundEntitiesIds = foundEntities.map(({ id }) => id);
    const result = items.filter(
      (item) => !foundEntitiesIds.includes(item.districtId),
    );

    const preparedErrors = getPreparedChildrenErrors(result, {
      field: exceptionField,
      messages: [AUTH_ERRORS.DISTRICT_NOT_EXIST],
    });
    throw new ExceptionsNotFound(preparedErrors);
  }

  public async allUsersExistingOrFail(
    users: NonEmptyArray<{ id: number; index: number }>,
  ): Promise<TUserDTO[]> {
    const ids = users.map(({ id }) => id) as NonEmptyArray<number>;
    const foundUsers = await this.usersRepository.getUsersByIds(ids);

    const foundUsersIds = foundUsers.map(({ id }) => id);
    if (foundUsersIds.length === ids.length) {
      return foundUsers;
    }

    const usersForException = users.filter(
      ({ id }) => !foundUsersIds.includes(id),
    );

    const preparedErrors = getPreparedChildrenErrors(usersForException, {
      field: 'id',
      messages: [USERS_ERRORS.USER_NOT_EXISTS],
    });
    throw new ExceptionsNotFound(preparedErrors);
  }

  public async getFullUserOrFail(
    conditions: RepositoryFindConditions<UserEntity>,
    serializeOptions?: ClassTransformOptions,
    exceptionField = 'id',
  ): Promise<TUserDTO> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('u')
      .select(USERS_MEMBER_RAW_SELECT)
      .where(conditions);

    this.usersRepository.addJoinsForMembersData(queryBuilder);

    const rawUser = await queryBuilder.getRawOne();

    if (!rawUser) {
      throw new ExceptionsNotFound([
        { field: exceptionField, messages: [AUTH_ERRORS.USER_NOT_FOUND] },
      ]);
    }

    return getSerializedMemberUser(rawUser, serializeOptions);
  }

  public async getDistrictLeaderOrFail(
    userId: number,
    exceptionField = 'userId',
  ): Promise<DistrictLeaderMemberDTO> {
    const user = await this.getFullUserOrFail({ id: userId });

    if (!isDistrictLeader(user)) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: exceptionField,
          messages: [USERS_ERRORS.SHOULD_BE_DISTRICT_LEADER],
        },
      ]);
    }

    return user;
  }
}
