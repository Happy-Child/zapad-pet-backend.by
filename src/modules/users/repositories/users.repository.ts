import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import {
  DistrictLeaderEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import { GeneralRepository } from '@app/repositories';
import { SimpleUserDTO } from '../dtos';
import { ExceptionsNotFound } from '@app/exceptions/errors';
import { ENTITIES_FIELDS, SORT_DURATION_DEFAULT } from '@app/constants';
import { AUTH_ERRORS } from '../../auth/constants';
import { TMemberDTO } from '../types';
import { RepositoryFindConditions } from '@app/repositories/types';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { getSerializedMemberUser } from '../helpers';
import {
  UsersGetListRequestQueryDTO,
  UsersGetListResponseBodyDTO,
} from '../dtos/users-getting.dtos';
import { USERS_LIST_DEFAULT_SORT_BY } from '../constants/clients-general.constants';
import { USER_ROLES } from '../constants';

const rawSelect = `u.*, sw.clientId as "clientId", sw.stationId as "stationId", dl.districtId as "leaderDistrictId", e.districtId as "engineerDistrictId"`;

@EntityRepository(UserEntity)
export class UsersRepository extends GeneralRepository<UserEntity> {
  protected entitySerializer = UserEntity;

  public async getFullUserOrFail(
    conditions: RepositoryFindConditions<UserEntity>,
    serializeOptions?: ClassTransformOptions,
  ): Promise<TMemberDTO | SimpleUserDTO> {
    const queryBuilder = this.createQueryBuilder('u')
      .select(rawSelect)
      .where(conditions);

    this.addJoinsForMembersData(queryBuilder);

    const rawUser = await queryBuilder.getRawOne();

    if (!rawUser) {
      throw new ExceptionsNotFound([
        { field: ENTITIES_FIELDS.ID, messages: [AUTH_ERRORS.USER_NOT_FOUND] },
      ]);
    }

    return getSerializedMemberUser(rawUser, serializeOptions);
  }

  public async getUsersWithPagination(
    data: UsersGetListRequestQueryDTO,
  ): Promise<UsersGetListResponseBodyDTO> {
    const totalSkip = data.skip || 0;
    const totalSortBy = data.sortBy || USERS_LIST_DEFAULT_SORT_BY;
    const totalSortDuration = data.sortDuration || SORT_DURATION_DEFAULT;

    const queryBuilder = this.createQueryBuilder('u')
      .select(rawSelect)
      .where(`u.role NOT IN ('${USER_ROLES.MASTER}')`);

    if (data.search) {
      queryBuilder.andWhere(
        `name LIKE '%${data.search}%' OR email LIKE '%${data.search}%'`,
      );
    }

    if (data.role?.length) {
      queryBuilder.andWhere(`role IN (:...values)`, { values: data.role });
      this.addJoinFilterMembersByRole(queryBuilder, data);
    }
    this.addJoinsForMembersData(queryBuilder);

    const totalItemsCount = await queryBuilder.getCount();
    const items = await queryBuilder
      .orderBy(`"${totalSortBy}"`, totalSortDuration)
      .offset(totalSkip)
      .limit(data.take)
      .getRawMany<TMemberDTO | SimpleUserDTO>();

    return {
      totalItemsCount,
      items,
      skip: totalSkip,
      take: data.take,
    };
  }

  // TODO empty result if set 'role[dl & e] & leaderDistrictId & engineerDistrictId'
  private addJoinFilterMembersByRole(
    builder: SelectQueryBuilder<UserEntity>,
    data: UsersGetListRequestQueryDTO,
  ): void {
    const filterStationsWorkers =
      data.role?.includes(USER_ROLES.STATION_WORKER) && data.clientId;
    const filterDistrictLeaders =
      data.role?.includes(USER_ROLES.DISTRICT_LEADER) && data.leaderDistrictId;
    const filterEngineers =
      data.role?.includes(USER_ROLES.ENGINEER) && data.engineerDistrictId;

    if (filterStationsWorkers) {
      builder.andWhere(`"sw"."clientId" = :id`, { id: data.clientId });
    } else if (filterDistrictLeaders) {
      builder.andWhere(`"dl"."districtId" = :id`, {
        id: data.leaderDistrictId,
      });
    } else if (filterEngineers) {
      builder.andWhere(`"e"."districtId" = :id`, {
        id: data.engineerDistrictId,
      });
    }
  }

  private addJoinsForMembersData(
    builder: SelectQueryBuilder<UserEntity>,
  ): void {
    builder
      .leftJoin(StationWorkerEntity, 'sw', '"sw"."userId" = u.id')
      .leftJoin(DistrictLeaderEntity, 'dl', '"dl"."userId" = u.id')
      .leftJoin(EngineerEntity, 'e', '"e"."userId" = u.id');
  }
}
