import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { DistrictsLeadersGeneralService } from './districts-leaders-general.service';
import { UsersCreateFullDistrictLeaderDTO } from '../../users/dtos';
import { EntityFinderGeneralService } from '../../entity-finder/services';

@Injectable()
export class DistrictsLeadersCheckBeforeCreateService {
  constructor(
    private readonly districtsLeadersGeneralService: DistrictsLeadersGeneralService,
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
  ) {}

  public async executeOrFail(
    districtLeaders: NonEmptyArray<UsersCreateFullDistrictLeaderDTO>,
  ): Promise<void> {
    const preparedDistrictsRecords = districtLeaders.map(
      ({ index, leaderDistrictId }) => ({
        index,
        districtId: leaderDistrictId,
      }),
    ) as NonEmptyArray<{ districtId: number; index: number }>;
    await this.entityFinderGeneralService.allDistrictsExistsOrFail(
      preparedDistrictsRecords,
    );
    await this.districtsLeadersGeneralService.allDistrictsWithoutLeadersOrFail(
      districtLeaders,
    );
  }
}
