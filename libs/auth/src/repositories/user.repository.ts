import { EntityRepository, Repository } from 'typeorm';
import { User } from '@app/entities';
import { UnprocessableEntity } from '@app/exceptions';
import { AUTH_ERRORS } from '@app/constants';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User> {
    return this.findOne({ email });
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
