import { EntityRepository, SelectQueryBuilder } from 'typeorm';
import {
  DistrictLeaderEntity,
  EngineerEntity,
  StationWorkerEntity,
  UserEntity,
} from '@app/entities';
import { GeneralRepository } from '@app/repositories';
import { AccountantDTO } from '../dtos';
import { SORT_DURATION_DEFAULT, USER_ROLES } from '@app/constants';
import { TMemberDTO } from '../types';
import {
  UsersGetListRequestQueryDTO,
  UsersGetListResponseBodyDTO,
} from '../dtos/users-getting.dtos';
import {
  USERS_LIST_DEFAULT_SORT_BY,
  USERS_MEMBER_RAW_SELECT,
} from '../constants';
import { NonEmptyArray } from '@app/types';
import { getSerializedMemberUser } from '../helpers';

@EntityRepository(UserEntity)
export class UsersRepository extends GeneralRepository<UserEntity> {
  protected entitySerializer = UserEntity;

  public async getUsersIds(
    ids: NonEmptyArray<number>,
  ): Promise<(TMemberDTO | AccountantDTO)[]> {
    const queryBuilder = this.createQueryBuilder('u')
      .select(USERS_MEMBER_RAW_SELECT)
      .where(`u.role NOT IN ('${USER_ROLES.MASTER}') AND u.id IN (:...ids)`, {
        ids,
      });

    this.addJoinsForMembersData(queryBuilder);

    const items = await queryBuilder
      .orderBy('"createdAt"')
      .getRawMany<TMemberDTO | AccountantDTO>();

    return items.map((item) => getSerializedMemberUser(item));
  }

  public async getUsersWithPagination(
    data: UsersGetListRequestQueryDTO,
  ): Promise<UsersGetListResponseBodyDTO> {
    const totalSkip = data.skip || 0;
    const totalSortBy = data.sortBy || USERS_LIST_DEFAULT_SORT_BY;
    const totalSortDuration = data.sortDuration || SORT_DURATION_DEFAULT;

    const queryBuilder = this.createQueryBuilder('u')
      .select(USERS_MEMBER_RAW_SELECT)
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
      .getRawMany<TMemberDTO | AccountantDTO>();

    const serializedItems = items.map((item) => getSerializedMemberUser(item));

    return {
      totalItemsCount,
      items: serializedItems,
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

  public addJoinsForMembersData(builder: SelectQueryBuilder<UserEntity>): void {
    builder
      .leftJoin(StationWorkerEntity, 'sw', '"sw"."userId" = u.id')
      .leftJoin(DistrictLeaderEntity, 'dl', '"dl"."userId" = u.id')
      .leftJoin(EngineerEntity, 'e', '"e"."userId" = u.id');
  }
}
