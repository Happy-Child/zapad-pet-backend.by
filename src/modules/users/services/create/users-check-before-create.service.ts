import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { DistrictsGeneralCheckingService } from '../../../districts/services';
import { DistrictsLeadersGeneralService } from '../../../districts-leaders/services';
import {
  UsersCreateFullDistrictLeaderDTO,
  UsersCreateFullEngineerDTO,
} from '../../dtos';

@Injectable()
export class UsersCheckBeforeCreateService {
  constructor(
    private readonly districtsGeneralCheckingService: DistrictsGeneralCheckingService,
    private readonly districtsLeadersGeneralService: DistrictsLeadersGeneralService,
  ) {}

  public async checkDistrictLeadersOrFail(
    districtLeaders: NonEmptyArray<UsersCreateFullDistrictLeaderDTO>,
  ): Promise<void> {
    const preparedDistrictsRecords = districtLeaders.map(
      ({ index, leaderDistrictId }) => ({
        index,
        districtId: leaderDistrictId,
      }),
    ) as NonEmptyArray<{ districtId: number; index: number }>;
    await this.districtsGeneralCheckingService.allDistrictsExistsOrFail(
      preparedDistrictsRecords,
    );
    await this.districtsLeadersGeneralService.allDistrictsWithoutLeadersOrFail(
      districtLeaders,
    );
  }

  public async checkEngineersOrFail(
    engineer: NonEmptyArray<UsersCreateFullEngineerDTO>,
  ): Promise<void> {
    const preparedDistrictsRecords = engineer.map(
      ({ index, engineerDistrictId }) => ({
        index,
        districtId: engineerDistrictId,
      }),
    ) as NonEmptyArray<{ districtId: number; index: number }>;
    await this.districtsGeneralCheckingService.allDistrictsExistsOrFail(
      preparedDistrictsRecords,
      'engineerDistrictId',
    );
  }
}
