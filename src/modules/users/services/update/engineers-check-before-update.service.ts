import { Injectable } from '@nestjs/common';
import { NonEmptyArray } from '@app/types';
import { UsersUpdateEngineerDTO } from '../../dtos/users-update.dtos';
import { TMemberDTO } from '../../types';
import { AccountantDTO } from '../../dtos';

@Injectable()
export class EngineersCheckBeforeUpdateService {
  public async executeOrFail(
    engineers: NonEmptyArray<UsersUpdateEngineerDTO & { index: number }>,
    foundUsers: (TMemberDTO | AccountantDTO)[],
  ): Promise<void> {
    console.log('engineers', engineers);
    //
  }
}
