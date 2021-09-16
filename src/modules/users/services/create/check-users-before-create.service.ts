import { Injectable } from '@nestjs/common';
import { UserRepository } from '@app/repositories';
import { ClientRepository } from '../../repositories/client.repository';
import { DistrictRepository } from '../../repositories/district.repository';
import {
  UsersCreateDistrictLeader,
  UsersCreateStationWorker,
  UsersCreateEngineer,
} from '../../interfaces/create.interfaces';
import { CheckGeneralUsersDataService } from '../common/check-general-users-data.service';

@Injectable()
export class CheckUsersBeforeCreateService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
    private readonly districtRepository: DistrictRepository,
    private readonly checkGeneralUsersDataService: CheckGeneralUsersDataService,
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
