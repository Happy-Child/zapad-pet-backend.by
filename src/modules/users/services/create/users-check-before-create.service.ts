import { Injectable } from '@nestjs/common';
import {
  UsersCreateDistrictLeader,
  UsersCreateStationWorker,
  UsersCreateEngineer,
} from '../../interfaces';
import { UsersCheckGeneralDataService } from '../common';

@Injectable()
export class UsersCheckBeforeCreateService {
  constructor(
    private readonly checkGeneralUsersDataService: UsersCheckGeneralDataService,
  ) {}

  public async checkStationWorkersOrFail(
    stationWorkers: UsersCreateStationWorker[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkStationWorkersOrFail(
      stationWorkers,
    );
    // CHECK OTHER
  }

  public async checkDistrictLeadersOrFail(
    districtLeaders: UsersCreateDistrictLeader[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkDistrictLeadersOrFail(
      districtLeaders,
    );
    // CHECK OTHER
  }

  public async checkEngineersOrFail(
    engineer: UsersCreateEngineer[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkEngineersOrFail(engineer);
    // CHECK OTHER
  }
}
