import { EntityRepository } from 'typeorm';
import { PasswordRecoveryEntity } from '@app/auth/entities';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/auth/constants';
import { ENTITIES_FIELDS } from '@app/entities';
import { SerializedPasswordRecoveryEntity } from '@app/auth/serializers';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(PasswordRecoveryEntity)
export class AuthPasswordRecoveryRepository extends GeneralRepository<
  PasswordRecoveryEntity,
  SerializedPasswordRecoveryEntity
> {
  protected entitySerializer = SerializedPasswordRecoveryEntity;

  async findByTokenOrFail(
    token: string,
  ): Promise<SerializedPasswordRecoveryEntity> {
    return this.getOneOrFail({
      conditions: { token },
      exception: {
        type: ExceptionsUnprocessableEntity,
        messages: [
          {
            field: ENTITIES_FIELDS.TOKEN,
            messages: [AUTH_ERRORS.TOKEN_NOT_FOUND],
          },
        ],
      },
    });
  }
}
