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
    // IF CHANGE DISTRICT ID - CHECK IF PREV DISTRICT NOT HAW ACTIVE BIDS & NEXT DISTRICT EMPTY
    // REMOVE THIS LEADER FROM PREV DISTRICT - IN OTHER SERVICE?
    // CHECK OTHER

    // GLOBAL - МЕТОД ПРОВЕРКИ НЕ ОБНОВЛЯЕМ ЛИ МЫ НА ЭТО ЖЕ ЗНАЧЕНИЕ.
    // Т.Е. БЫЛО ИМЯ "ЕГОР", ЛЕТИТ ИМЯ "ЕГОР" - ЭТО ПОЛЕ НЕ ОБНОВЛЯТЬ
  }

  public async checkEngineersOrFail(
    engineer: UsersCreateEngineer[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkEngineersOrFail(engineer);
    // CHECK IF NOT EXISTS ACTIVE BIDS?
    // CHECK OTHER
  }
}
