import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { UsersUpdateDistrictLeaderDTO } from '../../users/dtos/users-update.dtos';
import {
  groupedByChangedFields,
  groupedByValueOfObjectKeyWillBe,
} from '@app/helpers/grouped.helpers';
import { isNonEmptyArray } from '@app/helpers';
import { DistrictsLeadersRepository } from '../repositories';
import { BidEntity, StationEntity } from '@app/entities';
import { DISTRICTS_ERRORS } from '@app/constants';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { BID_STATUTES_BLOCKING_CHANGE_LEADER_ON_DISTRICT } from '../../districts/constants';
import { DistrictsLeadersGeneralService } from './index';
import { DistrictLeaderMemberDTO } from '../dtos';
import { EntityFinderGeneralService } from '../../entity-finder/services';

@Injectable()
export class DistrictsLeadersCheckBeforeUpdateService {
  constructor(
    private readonly districtsLeadersRepository: DistrictsLeadersRepository,
    private readonly districtsLeadersGeneralService: DistrictsLeadersGeneralService,
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
  ) {}

  public async executeOrFail(
    leaders: NonEmptyArray<UsersUpdateDistrictLeaderDTO & { index: number }>,
    foundLeaders: DistrictLeaderMemberDTO[],
  ): Promise<void> {
    const groupedLeadersToCheck = groupedByChangedFields(
      leaders,
      foundLeaders,
      ['leaderDistrictId'],
    );

    await this.checkExistingDistrictsOrFail(
      groupedLeadersToCheck.leaderDistrictId,
      foundLeaders,
    );

    await this.canBeDeleteReplacedDistrictsOrFail(
      groupedLeadersToCheck.leaderDistrictId,
      foundLeaders,
    );

    await this.checkAddedAndReplacedDistrictsOrFail(
      groupedLeadersToCheck.leaderDistrictId,
      foundLeaders,
    );
  }

  private async checkExistingDistrictsOrFail(
    groupByDistrictId: (UsersUpdateDistrictLeaderDTO & { index: number })[],
    foundLeaders: DistrictLeaderMemberDTO[],
  ): Promise<void> {
    const { added, replaced } = groupedByValueOfObjectKeyWillBe(
      groupByDistrictId,
      foundLeaders,
      'leaderDistrictId',
    );

    const addedAndReplacedStations = [...added, ...replaced];

    if (isNonEmptyArray(addedAndReplacedStations)) {
      const preparedRecords = addedAndReplacedStations.map(
        ({ leaderDistrictId, index }) => ({
          districtId: leaderDistrictId,
          index,
        }),
      ) as NonEmptyArray<{ districtId: number; index: number }>;

      await this.entityFinderGeneralService.allDistrictsExistsOrFail(
        preparedRecords,
      );
    }
  }

  private async canBeDeleteReplacedDistrictsOrFail(
    groupByDistrictId: (UsersUpdateDistrictLeaderDTO & { index: number })[],
    foundLeaders: DistrictLeaderMemberDTO[],
  ): Promise<void> {
    const { deleted, replaced } = groupedByValueOfObjectKeyWillBe(
      groupByDistrictId,
      foundLeaders,
      'leaderDistrictId',
    );

    const records = [...deleted, ...replaced];

    if (isNonEmptyArray(records)) {
      await this.allLeadersCanBeChangeDistrictsOrFail(records);
    }
  }

  private async allLeadersCanBeChangeDistrictsOrFail(
    items: NonEmptyArray<{ id: number; index: number }>,
  ): Promise<void> {
    const ids = items.map(({ id }) => id) as NonEmptyArray<number>;

    const records = await this.districtsLeadersRepository
      .createQueryBuilder('dl')
      .select('dl.userId as id, COUNT(b.id)::int AS count')
      .where('dl.userId IN (:...ids)', { ids })
      .leftJoin(
        StationEntity,
        'st',
        `"st"."districtId" = "dl"."leaderDistrictId"`,
      )
      .leftJoin(
        BidEntity,
        'b',
        `"b"."stationId" = st.id AND b.status IN (:...statuses)`,
        { statuses: BID_STATUTES_BLOCKING_CHANGE_LEADER_ON_DISTRICT },
      )
      .groupBy('dl.id')
      .getRawMany();

    const districtsForException = items.filter((item) =>
      records.find(({ id, count }) => id === item.id && count > 0),
    );

    if (districtsForException.length) {
      const preparedErrors = getPreparedChildrenErrors(districtsForException, {
        field: 'leaderDistrictId',
        messages: [DISTRICTS_ERRORS.IMPOSSIBLE_REMOVE_LEADER_FROM_DISTRICT],
      });
      throw new ExceptionsUnprocessableEntity(preparedErrors);
    }
  }

  private async checkAddedAndReplacedDistrictsOrFail(
    groupByDistrictId: (UsersUpdateDistrictLeaderDTO & { index: number })[],
    foundLeaders: DistrictLeaderMemberDTO[],
  ): Promise<void> {
    const { added, replaced, deleted } = groupedByValueOfObjectKeyWillBe(
      groupByDistrictId,
      foundLeaders,
      'leaderDistrictId',
    );

    const records = [...added, ...replaced].filter((leader) => {
      const foundLeaderByDistrictId = foundLeaders.find(
        ({ leaderDistrictId }) => leader.leaderDistrictId === leaderDistrictId,
      );

      if (!foundLeaderByDistrictId) return true;

      const foundLeaderBeChange = !![...deleted, ...replaced].find(
        ({ id }) => foundLeaderByDistrictId.id === id,
      );

      return !foundLeaderBeChange;
    });

    if (isNonEmptyArray(records)) {
      await this.districtsLeadersGeneralService.allDistrictsWithoutLeadersOrFail(
        records,
      );
    }
  }
}
