import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import {
  ExceptionsUnprocessableEntity,
  ExceptionsNotFound,
} from '@app/exceptions/errors';
import { AUTH_ERRORS } from '../../auth/constants';
import { ENTITIES_FIELDS } from '@app/constants';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { NonEmptyArray } from '@app/types';
import { UsersUpdateItemDTO } from '../dtos/users-update.dtos';
import { TUserDTO } from '../types';
import { USERS_ERRORS } from '../constants';

@Injectable()
export class UsersGeneralService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async allEmailsNotExistingOrFail(
    users: NonEmptyArray<{ email: string; index: number }>,
  ): Promise<void> {
    const emails = users.map(({ email }) => email) as NonEmptyArray<string>;

    const existingUsers = await this.usersRepository.getManyByColumn(
      emails,
      'email',
    );

    const existingUsersEmails = existingUsers.map(({ email }) => email);
    if (!existingUsersEmails.length) return;

    const usersForException = users.filter(({ email }) =>
      existingUsersEmails.includes(email),
    );

    const preparedErrors = getPreparedChildrenErrors(usersForException, {
      field: ENTITIES_FIELDS.EMAIL,
      messages: [AUTH_ERRORS.EMAIL_IS_EXIST],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }

  public async allUsersExistingOrFail(
    users: NonEmptyArray<UsersUpdateItemDTO & { index: number }>,
  ): Promise<TUserDTO[]> {
    const ids = users.map(({ id }) => id) as NonEmptyArray<number>;
    const foundUsers = await this.usersRepository.getUsersIds(ids);

    const foundUsersIds = foundUsers.map(({ id }) => id);
    if (foundUsersIds.length === ids.length) {
      return foundUsers;
    }

    const usersForException = users.filter(
      ({ id }) => !foundUsersIds.includes(id),
    );

    const preparedErrors = getPreparedChildrenErrors(usersForException, {
      field: 'id',
      messages: [USERS_ERRORS.USER_NOT_EXISTS],
    });
    throw new ExceptionsNotFound(preparedErrors);
  }
}
