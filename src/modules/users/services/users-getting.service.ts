import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import {
  UsersGetListRequestQueryDTO,
  UsersGetListResponseBodyDTO,
} from '../dtos/users-getting.dtos';
import { EntityFinderGeneralService } from '../../entity-finder/services';
import { TUserDTO } from '../types';

@Injectable()
export class UsersGettingService {
  constructor(
    private readonly usersRepository: UsersRepository,
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
  ) {}

  public async getUserOrFail(id: number): Promise<TUserDTO> {
    return this.entityFinderGeneralService.getFullUserOrFail({ id });
  }

  async getList(
    query: UsersGetListRequestQueryDTO,
  ): Promise<UsersGetListResponseBodyDTO> {
    return this.usersRepository.getUsersWithPagination(query);
  }
}
