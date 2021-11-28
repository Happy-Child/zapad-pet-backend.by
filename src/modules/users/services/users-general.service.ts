import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/constants';
import { ENTITIES_FIELDS } from '@app/constants';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { NonEmptyArray } from '@app/types';

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
}
