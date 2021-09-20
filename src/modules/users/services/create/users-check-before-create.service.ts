import { Injectable } from '@nestjs/common';
import {
  IUsersCreateDistrictLeader,
  IUsersCreateStationWorker,
  IUsersCreateEngineer,
} from '../../interfaces';
import { UsersCheckGeneralDataService } from '../common';

@Injectable()
export class UsersCheckBeforeCreateService {
  constructor(
    private readonly checkGeneralUsersDataService: UsersCheckGeneralDataService,
  ) {}

  public async checkStationWorkersOrFail(
    stationWorkers: IUsersCreateStationWorker[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkStationWorkersOrFail(
      stationWorkers,
    );
    // CHECK OTHER
  }

  public async checkDistrictLeadersOrFail(
    districtLeaders: IUsersCreateDistrictLeader[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkDistrictLeadersOrFail(
      districtLeaders,
    );
    // CHECK OTHER
  }

  public async checkEngineersOrFail(
    engineer: IUsersCreateEngineer[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkEngineersOrFail(engineer);
    // CHECK OTHER
  }
}
