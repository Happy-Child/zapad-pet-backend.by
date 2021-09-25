import { Injectable } from '@nestjs/common';
import { UsersCreateRequestBodyDTO } from '../../dtos';
import { UsersCheckBeforeCreateService } from './users-check-before-create.service';
import { UsersCheckGeneralDataService } from '../common';
import { getFilteredUsersToCreate } from '../../helpers';

@Injectable()
export class UsersCreateService {
  constructor(
    private readonly checkGeneralUsersDataService: UsersCheckGeneralDataService,
    private readonly usersCheckBeforeCreateService: UsersCheckBeforeCreateService,
  ) {}

  async create({ users }: UsersCreateRequestBodyDTO) {
    await this.checkGeneralUsersDataService.checkExistingEmailsOrFail(users);

    const { stationWorkers, engineers, districtLeaders, simples } =
      getFilteredUsersToCreate(users);

    if (stationWorkers.length) {
      await this.usersCheckBeforeCreateService.checkStationWorkersOrFail(
        stationWorkers,
      );
    }

    if (districtLeaders.length) {
      await this.usersCheckBeforeCreateService.checkDistrictLeadersOrFail(
        districtLeaders,
      );
    }

    if (engineers.length) {
      await this.usersCheckBeforeCreateService.checkEngineersOrFail(engineers);
    }

    if (simples.length) {
      //
    }
  }
}
