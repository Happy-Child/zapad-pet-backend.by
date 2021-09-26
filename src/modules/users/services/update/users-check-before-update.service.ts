import { Injectable } from '@nestjs/common';
import { UsersCheckGeneralDataService } from '../common';
import {
  IUsersCreateDistrictLeader,
  IUsersCreateEngineer,
} from '../../interfaces';

@Injectable()
export class UsersCheckBeforeUpdateService {
  constructor(
    private readonly checkGeneralUsersDataService: UsersCheckGeneralDataService,
  ) {}

  public async checkDistrictLeadersOrFail(
    districtLeaders: IUsersCreateDistrictLeader[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkClientMembersExistingDistrictsOrFail(
      districtLeaders,
    );
    // IF CHANGE DISTRICT ID - CHECK IF PREV DISTRICT NOT HAW ACTIVE BIDS & NEXT DISTRICT EMPTY
    // REMOVE THIS LEADER FROM PREV DISTRICT - IN OTHER SERVICE?
    // CHECK OTHER

    // GLOBAL - МЕТОД ПРОВЕРКИ НЕ ОБНОВЛЯЕМ ЛИ МЫ НА ЭТО ЖЕ ЗНАЧЕНИЕ.
    // Т.Е. БЫЛО ИМЯ "ЕГОР", ЛЕТИТ ИМЯ "ЕГОР" - ЭТО ПОЛЕ НЕ ОБНОВЛЯТЬ
  }

  public async checkEngineersOrFail(
    engineer: IUsersCreateEngineer[],
  ): Promise<void> {
    await this.checkGeneralUsersDataService.checkClientMembersExistingDistrictsOrFail(
      engineer,
    );
    // CHECK IF NOT EXISTS ACTIVE BIDS?
    // CHECK OTHER
  }
}
