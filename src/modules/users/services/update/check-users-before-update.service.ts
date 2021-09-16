import { Injectable } from '@nestjs/common';
import { UserRepository } from '@app/repositories';
import { ClientRepository } from '../../repositories/client.repository';
import { DistrictRepository } from '../../repositories/district.repository';
import { CheckGeneralUsersDataService } from '../common/check-general-users-data.service';
import {
  UsersCreateDistrictLeader,
  UsersCreateEngineer,
} from '../../interfaces/create.interfaces';

@Injectable()
export class CheckUsersBeforeUpdateService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly clientRepository: ClientRepository,
    private readonly districtRepository: DistrictRepository,
    private readonly checkGeneralUsersDataService: CheckGeneralUsersDataService,
  ) {}

  public async checkDistrictLeadersOrFail(
    districtLeaders: UsersCreateDistrictLeader[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkDistrictLeadersOrFail(
      districtLeaders,
    );
    // CHECK IF NOT EXISTS ACTIVE BIDS?
    // CHECK OTHER
  }

  public async checkEngineersOrFail(
    engineer: UsersCreateEngineer[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkEngineersOrFail(engineer);
    // CHECK IF NOT EXISTS ACTIVE BIDS?
    // CHECK OTHER
  }
}
