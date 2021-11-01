import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../repositories';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '../../auth/constants';
import { ENTITIES_FIELDS } from '@app/constants';
import { getPreparedChildrenErrors } from '@app/helpers/prepared-errors.helpers';
import { NonEmptyArray } from '@app/types';

@Injectable()
export class UsersGeneralService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async allEmailsNotExistingOrFail(
    emails: NonEmptyArray<string>,
  ): Promise<void> {
    const existingUsers = await this.usersRepository.getManyByColumn(
      emails,
      'email',
    );

    if (!existingUsers.length) return;

    const preparedExistingUsers = existingUsers.map((user) => {
      const index = emails.findIndex((email) => email === user.email);
      return { ...user, index };
    });

    const preparedErrors = getPreparedChildrenErrors(preparedExistingUsers, {
      field: ENTITIES_FIELDS.EMAIL,
      messages: [AUTH_ERRORS.EMAIL_IS_EXIST],
    });
    throw new ExceptionsUnprocessableEntity(preparedErrors);
  }
}
