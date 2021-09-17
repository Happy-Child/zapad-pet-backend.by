import { Injectable } from '@nestjs/common';
import { UsersCheckGeneralDataService } from '../common';
import {
  UsersCreateDistrictLeader,
  UsersCreateEngineer,
} from '../../interfaces';

@Injectable()
export class UsersCheckBeforeUpdateService {
  constructor(
    private readonly checkGeneralUsersDataService: UsersCheckGeneralDataService,
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
