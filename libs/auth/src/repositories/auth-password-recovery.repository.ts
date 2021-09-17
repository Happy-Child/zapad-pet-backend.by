import { EntityRepository, Repository } from 'typeorm';
import { UnprocessableEntity } from '@app/exceptions';
import { AUTH_ERRORS, PasswordRecovery } from '@app/auth';

@EntityRepository(PasswordRecovery)
export class AuthPasswordRecoveryRepository extends Repository<PasswordRecovery> {
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
