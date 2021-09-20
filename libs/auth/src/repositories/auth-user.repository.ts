import { EntityRepository, Repository } from 'typeorm';
import { User } from '@app/entities';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/auth/constants';

@EntityRepository(User)
export class AuthUserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User | null> {
    const user = await this.findOne({ email });
    return user || null;
  }

  async findByEmailOrFail(email: string): Promise<User> {
    const user = await this.findByEmail(email);
    if (!user) {
      throw new ExceptionsUnprocessableEntity([
        { field: 'email', messages: [AUTH_ERRORS.USER_NOT_FOUND] },
      ]);
    }
    return user;
  }
}
