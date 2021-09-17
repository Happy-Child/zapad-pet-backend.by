import { EntityRepository, Repository } from 'typeorm';
import { UnprocessableEntity } from '@app/exceptions';
import { AUTH_ERRORS, EmailConfirmed } from '@app/auth';

@EntityRepository(EmailConfirmed)
export class AuthEmailConfirmedRepository extends Repository<EmailConfirmed> {
  async findByTokenOrFail(token: string): Promise<EmailConfirmed> {
    const emailConfirmationData = await this.findOne({ token });
    if (!emailConfirmationData) {
      throw new UnprocessableEntity([
        { field: 'token', message: AUTH_ERRORS.TOKEN_NOT_FOUND },
      ]);
    }
    return emailConfirmationData;
  }
}
