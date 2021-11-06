import { Injectable } from '@nestjs/common';
import {
  UsersUpdateItemDTO,
  UsersUpdateRequestBodyDTO,
} from '../../dtos/users-update.dtos';
import { UsersRepository } from '../../repositories';
import { getIndexedArray } from '@app/helpers';
import { UsersGeneralService } from '../users-general.service';
import { UsersCheckBeforeUpdateService } from './users-check-before-update.service';

@Injectable()
export class UsersUpdateService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly usersGeneralService: UsersGeneralService,
    private readonly usersCheckBeforeUpdateService: UsersCheckBeforeUpdateService,
  ) {}

  public async execute({ users }: UsersUpdateRequestBodyDTO): Promise<void> {
    const indexedUsers = getIndexedArray(users);
    await this.usersCheckBeforeUpdateService.executeOrFail(indexedUsers);
    await this.update(indexedUsers);
  }

  private async update(users: UsersUpdateItemDTO[]): Promise<void> {
    // users
  }
}
