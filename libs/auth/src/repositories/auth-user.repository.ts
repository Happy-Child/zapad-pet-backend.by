import { EntityRepository } from 'typeorm';
import { ENTITIES_FIELDS, UserEntity } from '@app/entities';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/auth/constants';
import { GeneralRepository } from '@app/repositories';
import { SerializedUserEntity, USER_SERIALIZERS_GROUPS } from '@app/user';

const exceptionOnFail = {
  type: ExceptionsUnprocessableEntity,
  messages: [
    {
      field: ENTITIES_FIELDS.EMAIL,
      messages: [AUTH_ERRORS.USER_NOT_FOUND],
    },
  ],
};

@EntityRepository(UserEntity)
export class AuthUserRepository extends GeneralRepository<
  UserEntity,
  SerializedUserEntity
> {
  protected entitySerializer = SerializedUserEntity;

  async findByEmail(email: string): Promise<SerializedUserEntity | null> {
    return this.getOne({ email });
  }

  async findByEmailOrFail(email: string): Promise<SerializedUserEntity> {
    return this.getOneOrFail({
      conditions: { email },
      exception: exceptionOnFail,
    });
  }

  async findWithPasswordByEmailOrFail(
    email: string,
  ): Promise<RequiredOne<SerializedUserEntity, 'password'>> {
    const user = await this.getOneOrFail(
      {
        conditions: { email },
        exception: exceptionOnFail,
      },
      { groups: [USER_SERIALIZERS_GROUPS.PASSWORD] },
    );

    return user as RequiredOne<SerializedUserEntity, 'password'>;
  }
}
