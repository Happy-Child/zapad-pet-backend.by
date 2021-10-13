import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import {
  UsersGetListRequestQueryDTO,
  UsersGetListResponseBodyDTO,
} from '../dtos/users-getting.dtos';

@Injectable()
export class UsersGettingService {
  constructor(private readonly usersRepository: UsersRepository) {}

  async getList(
    query: UsersGetListRequestQueryDTO,
  ): Promise<UsersGetListResponseBodyDTO> {
    const result = await this.usersRepository.getUsersWithPagination(query);
    return new UsersGetListResponseBodyDTO(result);
  }
}
