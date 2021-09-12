import { EntityRepository, Repository } from 'typeorm';
import { PasswordRecovery } from '@app/entities';
import { UnprocessableEntity } from '@app/exceptions';
import { AUTH_ERRORS } from '@app/auth/constants/errors.constants';

@EntityRepository(PasswordRecovery)
export class PasswordRecoveryRepository extends Repository<PasswordRecovery> {
  async findByTokenOrFail(token: string): Promise<PasswordRecovery> {
    const passwordRecoveryData = await this.findOne({ token });
    if (!passwordRecoveryData) {
      throw new UnprocessableEntity([
        { field: 'token', message: AUTH_ERRORS.TOKEN_NOT_FOUND },
      ]);
    }
    return passwordRecoveryData;
  }
}
