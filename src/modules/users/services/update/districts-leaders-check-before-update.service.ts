import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { UsersUpdateDistrictLeaderDTO } from '../../dtos/users-update.dtos';
import { TMemberDTO } from '../../types';
import { AccountantDTO } from '../../dtos';

@Injectable()
export class DistrictsLeadersCheckBeforeUpdateService {
  public async executeOrFail(
    leaders: NonEmptyArray<UsersUpdateDistrictLeaderDTO & { index: number }>,
    foundUsers: (TMemberDTO | AccountantDTO)[],
  ): Promise<void> {
    console.log('leaders', leaders);
    //
  }
}
