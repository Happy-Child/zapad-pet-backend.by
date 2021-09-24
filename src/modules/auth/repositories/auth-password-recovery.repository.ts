import { EntityRepository } from 'typeorm';
import { PasswordRecoveryEntity } from '../entities';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '../constants';
import { ENTITIES_FIELDS } from '@app/entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(PasswordRecoveryEntity)
export class AuthPasswordRecoveryRepository extends GeneralRepository<PasswordRecoveryEntity> {
  protected entitySerializer = PasswordRecoveryEntity;

  async findByTokenOrFail(token: string): Promise<PasswordRecoveryEntity> {
    return this.getOneOrFail(
      { token },
      {
        exception: {
          type: ExceptionsUnprocessableEntity,
          messages: [
            {
              field: ENTITIES_FIELDS.TOKEN,
              messages: [AUTH_ERRORS.TOKEN_NOT_FOUND],
            },
          ],
        },
      },
    );
  }
}
