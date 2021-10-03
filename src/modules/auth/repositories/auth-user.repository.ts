import { EntityRepository } from 'typeorm';
import { ENTITIES_FIELDS, UserEntity } from '@app/entities';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '../constants';
import { GeneralRepository } from '@app/repositories';
import { USER_SERIALIZERS_GROUPS } from '../../users/constants';

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
export class AuthUserRepository extends GeneralRepository<UserEntity> {
  protected entitySerializer = UserEntity;

  async findByEmailOrFail(email: string): Promise<UserEntity> {
    return this.getOneOrFail({ email }, { exception: exceptionOnFail });
  }

  async findWithPasswordByEmailOrFail(
    email: string,
  ): Promise<RequiredOne<UserEntity, 'password'>> {
    const user = await this.getOneOrFail(
      { email },
      {
        exception: exceptionOnFail,
        serialize: { groups: [USER_SERIALIZERS_GROUPS.PASSWORD] },
      },
    );

    return user as RequiredOne<UserEntity, 'password'>;
  }
}
