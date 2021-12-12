import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { NonEmptyArray } from '@app/types';
import { UsersRepository } from '../repositories';
import { EntityFinderGeneralService } from '../../entity-finder/services';
import { getIndexedArray, groupedByRoles, isNonEmptyArray } from '@app/helpers';
import { TUserDTO } from '../types';
import { StationWorkerMemberDTO } from '../../stations-workers/dtos';
import { DistrictLeaderMemberDTO } from '../../districts-leaders/dtos';
import { EngineerMemberDTO } from '../../engineers/dtos';
import { USER_ROLES, USERS_ERRORS } from '@app/constants';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { allFieldsHasValueOrFail } from '@app/helpers';
import { StationsWorkersRepository } from '../../stations-workers/repositories';
import { DistrictsLeadersRepository } from '../../districts-leaders/repositories';
import { EngineersRepository } from '../../engineers/repositories';

@Injectable()
export class UsersDeleteService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly connection: Connection,
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
  ) {}

  public async execute(ids: NonEmptyArray<number>): Promise<true> {
    const users = await this.canBeDeleteUsersOrFail(ids);

    const finalIds = ids.filter((id) =>
      users.find((user) => user.id === id && user.role !== USER_ROLES.MASTER),
    );
    await this.deleteUsersByIds(finalIds);

    return true;
  }

  private async canBeDeleteUsersOrFail(
    ids: number[],
  ): Promise<NonEmptyArray<TUserDTO>> {
    const indexedIds = ids.map((id, index) => ({
      id,
      index,
    })) as NonEmptyArray<{ id: number; index: number }>;
    const users = (await this.entityFinderGeneralService.allUsersExistingOrFail(
      indexedIds,
      'ids',
    )) as NonEmptyArray<TUserDTO>;

    const { stationsWorkers, districtsLeaders, engineers } = groupedByRoles<
      StationWorkerMemberDTO & { index: number },
      DistrictLeaderMemberDTO & { index: number },
      EngineerMemberDTO & { index: number }
    >(getIndexedArray(users));

    if (isNonEmptyArray(stationsWorkers)) {
      allFieldsHasValueOrFail(
        stationsWorkers,
        'stationId',
        null,
        ExceptionsUnprocessableEntity,
        {
          field: 'ids',
          messages: [USERS_ERRORS.IMPOSSIBLE_REMOVE_STATION_WORKER],
        },
      );
    }
    if (isNonEmptyArray(districtsLeaders)) {
      allFieldsHasValueOrFail(
        districtsLeaders,
        'leaderDistrictId',
        null,
        ExceptionsUnprocessableEntity,
        {
          field: 'ids',
          messages: [USERS_ERRORS.IMPOSSIBLE_REMOVE_DISTRICT_LEADER],
        },
      );
    }
    if (isNonEmptyArray(engineers)) {
      allFieldsHasValueOrFail(
        engineers,
        'engineerDistrictId',
        null,
        ExceptionsUnprocessableEntity,
        {
          field: 'ids',
          messages: [USERS_ERRORS.IMPOSSIBLE_REMOVE_ENGINEER],
        },
      );
    }

    return users;
  }

  private async deleteUsersByIds(ids: number[]): Promise<void> {
    await this.connection.transaction(async (manager) => {
      const stationsWorkersRepo = manager.getCustomRepository(
        StationsWorkersRepository,
      );
      const districtsLeadersRepo = manager.getCustomRepository(
        DistrictsLeadersRepository,
      );
      const engineersRepo = manager.getCustomRepository(EngineersRepository);
      const usersRepo = manager.getCustomRepository(UsersRepository);

      await Promise.all([
        stationsWorkersRepo.deleteEntitiesByWhere(
          '"stations_workers"."userId" IN (:...ids)',
          {
            ids,
          },
        ),
        districtsLeadersRepo.deleteEntitiesByWhere(
          '"districts_leaders"."userId" IN (:...ids)',
          { ids },
        ),
        engineersRepo.deleteEntitiesByWhere(
          '"engineers"."userId" IN (:...ids)',
          {
            ids,
          },
        ),
        usersRepo.deleteEntitiesByIds(ids),
      ]);
    });
  }
}
