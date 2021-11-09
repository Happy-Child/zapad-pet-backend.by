import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { UsersUpdateDistrictLeaderDTO } from '../../dtos/users-update.dtos';
import { DistrictLeaderMemberDTO } from '../../dtos';
import {
  groupedByChangedFields,
  groupedByNextStateValues,
} from '@app/helpers/grouped.helpers';
import { isNonEmptyArray } from '@app/helpers';
import { DistrictsGeneralService } from '../../../districts/services';
import { DistrictsLeadersRepository } from '../../../districts-leaders/repositories';

@Injectable()
export class DistrictsLeadersCheckBeforeUpdateService {
  constructor(
    private readonly districtsGeneralService: DistrictsGeneralService,
    private readonly districtsLeadersRepository: DistrictsLeadersRepository,
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

    await this.deleteReplacedDistrictsOrFail(
      groupedLeadersToCheck.leaderDistrictId,
      foundLeaders,
    );
  }

  private async deleteReplacedDistrictsOrFail(
    groupByDistrictId: (UsersUpdateDistrictLeaderDTO & { index: number })[],
    foundLeaders: DistrictLeaderMemberDTO[],
  ): Promise<void> {
    const { deleted, replaced } = groupedByNextStateValues(
      groupByDistrictId,
      foundLeaders,
      'leaderDistrictId',
    );

    const records = [...deleted, ...replaced];

    if (isNonEmptyArray(records)) {
      const preparedDistricts = records.map(({ leaderDistrictId, index }) => ({
        districtId: leaderDistrictId,
        index,
      })) as NonEmptyArray<{ districtId: number; index: number }>;

      await this.districtsGeneralService.allDistrictsCanBeChangeLeadersOrFail(
        preparedDistricts,
      );
    }
  }
}
