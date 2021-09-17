import { EntityRepository, Repository } from 'typeorm';
import { UnprocessableEntity } from '@app/exceptions';
import { AUTH_ERRORS } from '@app/auth';
import { User } from '../../../../src/modules/users';

@EntityRepository(User)
export class AuthUserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.findOne({ email });
    return user || null;
  }

  async findByEmailOrFail(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new UnprocessableEntity([
        { field: 'email', message: AUTH_ERRORS.USER_NOT_FOUND },
      ]);
    }
    return user;
  }
}
