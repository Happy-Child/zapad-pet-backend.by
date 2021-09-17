import { EntityRepository, Repository } from 'typeorm';
import { User } from '@app/entities';
import { UnprocessableEntity } from '@app/exceptions';
import { AUTH_ERRORS } from '@app/auth/constants/errors.constants';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
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

  async findUsersByEmails(emails: string[]): Promise<User[]> {
    return this.createQueryBuilder('u')
      .where('u.email IN (:...emails)', { emails })
      .orderBy('u.id')
      .getMany();
  }
}
