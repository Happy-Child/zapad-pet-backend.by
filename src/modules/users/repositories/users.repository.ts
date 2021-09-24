import { EntityRepository, Repository } from 'typeorm';
import { UserEntity } from '../entities';

@EntityRepository(UserEntity)
export class UsersRepository extends Repository<UserEntity> {
  async findUsersByEmails(emails: string[]): Promise<UserEntity[]> {
    return this.createQueryBuilder('u')
      .where('u.email IN (:...emails)', { emails })
      .orderBy('u.id')
      .getMany();
  }
}
