import { EntityRepository } from 'typeorm';
import { EmailConfirmedEntity } from '@app/auth/entities';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/auth/constants';
import { ENTITIES_FIELDS } from '@app/entities';
import { GeneralRepository } from '@app/repositories';
import { SerializedEmailConfirmedEntity } from '@app/auth/serializers';

@EntityRepository(EmailConfirmedEntity)
export class AuthEmailConfirmedRepository extends GeneralRepository<
  EmailConfirmedEntity,
  SerializedEmailConfirmedEntity
> {
  protected entitySerializer = SerializedEmailConfirmedEntity;

  async findByTokenOrFail(
    token: string,
  ): Promise<SerializedEmailConfirmedEntity> {
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
