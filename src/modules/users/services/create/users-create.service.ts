import { Injectable } from '@nestjs/common';
import { UsersCreateRequestBodyDTO } from '../../dtos';
import { UsersCheckBeforeCreateService } from './users-check-before-create.service';
import { UsersCheckGeneralDataService } from '../common';
import { getFilteredUsersToCreate } from '../../helpers';
import {
  UsersCreateDistrictLeader,
  UsersCreateStationWorker,
  UsersCreateEngineer,
} from '../../interfaces';

@Injectable()
export class UsersCreateService {
  constructor(
    private readonly checkGeneralUsersDataService: UsersCheckGeneralDataService,
    private readonly usersCheckBeforeCreateService: UsersCheckBeforeCreateService,
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
    // transaction(() => { this.generalCreateUser(); ...other })
  }

  private async createDistrictLeaders(
    districtLeaders: UsersCreateDistrictLeader[],
  ): Promise<void> {
    await this.usersCheckBeforeCreateService.checkDistrictLeadersOrFail(
      districtLeaders,
    );
    // transaction(() => { this.generalCreateUser(); ...other })
  }

  private async createEngineers(
    engineers: UsersCreateEngineer[],
  ): Promise<void> {
    await this.usersCheckBeforeCreateService.checkEngineersOrFail(engineers);
    // transaction(() => { this.generalCreateUser(); ...other })
  }

  // private async generalCreateUser() { ... }
}
