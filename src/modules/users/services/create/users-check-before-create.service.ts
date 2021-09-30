import { Injectable } from '@nestjs/common';
import { UsersCheckGeneralDataService } from '../common';
import {
  UsersCreateDistrictLeaderDTO,
  UsersCreateEngineerDTO,
  UsersCreateStationWorkerDTO,
} from '../../dtos';

@Injectable()
export class UsersCheckBeforeCreateService {
  constructor(
    private readonly checkGeneralUsersDataService: UsersCheckGeneralDataService,
  ) {}

  public async checkStationWorkersOrFail(
    stationWorkers: (UsersCreateStationWorkerDTO & { index: number })[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkExistingClientsInArrayOrFail(
      stationWorkers,
    );
  }

  public async checkDistrictLeadersOrFail(
    districtLeaders: (UsersCreateDistrictLeaderDTO & { index: number })[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkExistingDistrictsInArrayOrFail(
      districtLeaders,
    );
    await this.checkGeneralUsersDataService.checkEmptyDistrictsOrFail(
      districtLeaders,
    );
  }

  public async checkEngineersOrFail(
    engineer: (UsersCreateEngineerDTO & { index: number })[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkExistingDistrictsInArrayOrFail(
      engineer,
    );
  }
}
