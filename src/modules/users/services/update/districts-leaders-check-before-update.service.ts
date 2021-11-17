import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { UsersUpdateDistrictLeaderDTO } from '../../dtos/users-update.dtos';
import { DistrictLeaderMemberDTO } from '../../dtos';
import {
  groupedByChangedFields,
  groupedByValueOfObjectKeyWillBe,
} from '@app/helpers/grouped.helpers';
import { isNonEmptyArray } from '@app/helpers';
import { DistrictsGeneralService } from '../../../districts/services';
import { DistrictsLeadersRepository } from '../../../districts-leaders/repositories';
import { BidEntity, StationEntity } from '@app/entities';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import {
  BID_STATUTES_BLOCKING_CHANGE_LEADER_ON_DISTRICT,
  DISTRICTS_ERRORS,
} from '../../../districts/constants';
import { DistrictsLeadersGeneralService } from '../../../districts-leaders/services';
import { EntityManager } from 'typeorm';

@Injectable()
export class DistrictsLeadersCheckBeforeUpdateService {
  constructor(
    private readonly districtsGeneralService: DistrictsGeneralService,
    private readonly districtsLeadersRepository: DistrictsLeadersRepository,
    private readonly districtsLeadersGeneralService: DistrictsLeadersGeneralService,
  ) {}

  public async executeOrFail(
    leaders: NonEmptyArray<UsersUpdateDistrictLeaderDTO & { index: number }>,
    foundLeaders: DistrictLeaderMemberDTO[],
    entityManager: EntityManager,
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

    const districtsLeadersRepository = entityManager.getCustomRepository(
      DistrictsLeadersRepository,
    );
    await this.canBeDeleteReplacedDistrictsAndDoItOrFail(
      groupedLeadersToCheck.leaderDistrictId,
      foundLeaders,
      districtsLeadersRepository,
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

      await this.districtsGeneralService.allDistrictsExistsOrFail(
        preparedRecords,
      );
    }
  }

  private async canBeDeleteReplacedDistrictsAndDoItOrFail(
    groupByDistrictId: (UsersUpdateDistrictLeaderDTO & { index: number })[],
    foundLeaders: DistrictLeaderMemberDTO[],
    districtsLeadersRepository: DistrictsLeadersRepository,
  ): Promise<void> {
    const { deleted, replaced } = groupedByValueOfObjectKeyWillBe(
      groupByDistrictId,
      foundLeaders,
      'leaderDistrictId',
    );

    const records = [...deleted, ...replaced];

    if (isNonEmptyArray(records)) {
      await this.allLeadersCanBeChangeDistrictsOrFail(records);
      await districtsLeadersRepository.updateEntities(
        records.map(({ id }) => ({
          criteria: { userId: id },
          inputs: { districtId: null },
        })),
      );
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
      .leftJoin(StationEntity, 'st', `"st"."districtId" = "dl"."districtId"`)
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
    const { added, replaced } = groupedByValueOfObjectKeyWillBe(
      groupByDistrictId,
      foundLeaders,
      'leaderDistrictId',
    );

    const records = [...added, ...replaced];

    if (isNonEmptyArray(records)) {
      await this.districtsLeadersGeneralService.allDistrictsWithoutLeadersOrFail(
        records,
      );
    }
  }
}
