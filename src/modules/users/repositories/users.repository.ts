import { EntityRepository, Repository } from 'typeorm';
import { User } from '../entities';

@EntityRepository(User)
export class UsersRepository extends Repository<User> {
  async findUsersByEmails(emails: string[]): Promise<User[]> {
    return this.createQueryBuilder('u')
      .where('u.email IN (:...emails)', { emails })
      .orderBy('u.id')
      .getMany();
  }
}
