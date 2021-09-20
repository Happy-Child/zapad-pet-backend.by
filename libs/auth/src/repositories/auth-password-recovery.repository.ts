import { EntityRepository, Repository } from 'typeorm';
import { PasswordRecovery } from '@app/auth/entities';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/auth/constants';

@EntityRepository(PasswordRecovery)
export class AuthPasswordRecoveryRepository extends Repository<PasswordRecovery> {
  async findByTokenOrFail(token: string): Promise<PasswordRecovery> {
    const passwordRecoveryData = await this.findOne({ token });
    if (!passwordRecoveryData) {
      throw new ExceptionsUnprocessableEntity([
        { field: 'token', messages: [AUTH_ERRORS.TOKEN_NOT_FOUND] },
      ]);
    }
    return passwordRecoveryData;
  }
}
