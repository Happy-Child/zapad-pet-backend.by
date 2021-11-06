import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { UsersUpdateStationWorkerDTO } from '../../dtos/users-update.dtos';
import { TMemberDTO } from '../../types';
import { AccountantDTO } from '../../dtos';

@Injectable()
export class StationsWorkersCheckBeforeUpdateService {
  public async executeOrFail(
    workers: NonEmptyArray<UsersUpdateStationWorkerDTO & { index: number }>,
    foundUsers: (TMemberDTO | AccountantDTO)[],
  ): Promise<void> {
    //
  }
}
