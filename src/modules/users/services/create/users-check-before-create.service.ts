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
    await this.checkGeneralUsersDataService.checkStationWorkersExistingClientsOrFail(
      stationWorkers,
    );
  }

  public async checkDistrictLeadersOrFail(
    districtLeaders: IUsersCreateDistrictLeader[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkClientMembersExistingDistrictsOrFail(
      districtLeaders,
    );
    await this.checkGeneralUsersDataService.checkEmptyDistrictsOrFail(
      districtLeaders,
    );
  }

  public async checkEngineersOrFail(
    engineer: IUsersCreateEngineer[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkClientMembersExistingDistrictsOrFail(
      engineer,
    );
  }
}
