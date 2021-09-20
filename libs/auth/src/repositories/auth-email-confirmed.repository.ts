import { EntityRepository, Repository } from 'typeorm';
import { EmailConfirmed } from '@app/auth/entities';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/auth/constants';

@EntityRepository(EmailConfirmed)
export class AuthEmailConfirmedRepository extends Repository<EmailConfirmed> {
  async findByTokenOrFail(token: string): Promise<EmailConfirmed> {
    const emailConfirmationData = await this.findOne({ token });
    if (!emailConfirmationData) {
      throw new ExceptionsUnprocessableEntity([
        { field: 'token', messages: [AUTH_ERRORS.TOKEN_NOT_FOUND] },
      ]);
    }
    return emailConfirmationData;
  }
}
