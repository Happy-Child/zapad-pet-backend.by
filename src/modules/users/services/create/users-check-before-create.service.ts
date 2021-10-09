import { Injectable } from '@nestjs/common';
import { UsersGeneralCheckService } from '../general';
import {
  UsersCreateDistrictLeaderDTO,
  UsersCreateEngineerDTO,
  UsersCreateStationWorkerDTO,
} from '../../dtos';

@Injectable()
export class UsersCheckBeforeCreateService {
  constructor(
    private readonly usersGeneralCheckService: UsersGeneralCheckService,
  ) {}

  public async checkStationWorkersOrFail(
    stationWorkers: (UsersCreateStationWorkerDTO & { index: number })[],
  ): Promise<void> {
    await this.usersGeneralCheckService.checkExistingClientsOrFail(
      stationWorkers,
    );
  }

  public async checkDistrictLeadersOrFail(
    districtLeaders: (UsersCreateDistrictLeaderDTO & { index: number })[],
  ): Promise<void> {
    await this.usersGeneralCheckService.checkExistingDistrictsOrFail(
      districtLeaders,
    );
    await this.usersGeneralCheckService.checkEmptyDistrictsOrFail(
      districtLeaders,
    );
  }

  public async checkEngineersOrFail(
    engineer: (UsersCreateEngineerDTO & { index: number })[],
  ): Promise<void> {
    await this.usersGeneralCheckService.checkExistingDistrictsOrFail(engineer);
  }
}
