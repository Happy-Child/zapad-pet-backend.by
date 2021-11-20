import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import {
  UsersGetListRequestQueryDTO,
  UsersGetListResponseBodyDTO,
} from '../dtos/users-getting.dtos';
import { RepositoryFindConditions } from '@app/repositories/types';
import { UserEntity } from '@app/entities';
import { ClassTransformOptions } from 'class-transformer/types/interfaces';
import { TUserDTO } from '../types';
import { ExceptionsNotFound } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '../../auth/constants';
import { getSerializedMemberUser } from '../helpers';
import { USERS_MEMBER_RAW_SELECT } from '../constants';

@Injectable()
export class UsersGettingService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async getFullUserOrFail(
    conditions: RepositoryFindConditions<UserEntity>,
    serializeOptions?: ClassTransformOptions,
    exceptionField = 'id',
  ): Promise<TUserDTO> {
    const queryBuilder = this.usersRepository
      .createQueryBuilder('u')
      .select(USERS_MEMBER_RAW_SELECT)
      .where(conditions);

    this.usersRepository.addJoinsForMembersData(queryBuilder);

    const rawUser = await queryBuilder.getRawOne();

    if (!rawUser) {
      throw new ExceptionsNotFound([
        { field: exceptionField, messages: [AUTH_ERRORS.USER_NOT_FOUND] },
      ]);
    }

    return getSerializedMemberUser(rawUser, serializeOptions);
  }

  async getList(
    query: UsersGetListRequestQueryDTO,
  ): Promise<UsersGetListResponseBodyDTO> {
    const result = await this.usersRepository.getUsersWithPagination(query);
    return new UsersGetListResponseBodyDTO(result);
  }
}
