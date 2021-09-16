import { Injectable } from '@nestjs/common';
import { UsersCreateRequestBodyDTO } from '../../dtos/create.dtos';
import { CheckUsersBeforeCreateService } from './check-users-before-create.service';
import { getFilteredUsersToCreate } from '../../helpers/create.helpers';
import {
  UsersCreateDistrictLeader,
  UsersCreateStationWorker,
  UsersCreateEngineer,
} from '../../interfaces/create.interfaces';
import { CheckGeneralUsersDataService } from '../common/check-general-users-data.service';

@Injectable()
export class UsersCreateService {
  constructor(
    private readonly checkGeneralUsersDataService: CheckGeneralUsersDataService,
    private readonly usersCheckBeforeCreateService: CheckUsersBeforeCreateService,
  ) {}

  async create({ users }: UsersCreateRequestBodyDTO) {
    const emails = users.map(({ email }) => email);
    await this.checkGeneralUsersDataService.checkUsersEmailsOrFail(emails);

    const { stationWorkers, engineers, districtLeaders } =
      getFilteredUsersToCreate(users);

    if (stationWorkers.length) {
      await this.createStationWorkers(stationWorkers);
    }

    if (districtLeaders.length) {
      await this.createDistrictLeaders(districtLeaders);
    }

    if (engineers.length) {
      await this.createEngineers(engineers);
    }
  }

  private async createStationWorkers(
    stationWorkers: UsersCreateStationWorker[],
  ): Promise<void> {
    await this.usersCheckBeforeCreateService.checkStationWorkersOrFail(
      stationWorkers,
    );
    // FINAL CREATE (relation and other)
    // transaction(() => { this.generalCreateUser(); ...other })
  }

  private async createDistrictLeaders(
    districtLeaders: UsersCreateDistrictLeader[],
  ): Promise<void> {
    await this.usersCheckBeforeCreateService.checkDistrictLeadersOrFail(
      districtLeaders,
    );
    // FINAL CREATE (relation and other)
    // transaction(() => { this.generalCreateUser(); ...other })
  }

  private async createEngineers(
    engineers: UsersCreateEngineer[],
  ): Promise<void> {
    await this.usersCheckBeforeCreateService.checkEngineersOrFail(engineers);
    // FINAL CREATE (relation and other)
    // transaction(() => { this.generalCreateUser(); ...other })
  }

  // private async generalCreateUser() { ... }
}
