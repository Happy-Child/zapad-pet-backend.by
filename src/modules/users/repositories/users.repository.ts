import { EntityRepository } from 'typeorm';
import { UserEntity } from '../entities';
import { GeneralRepository } from '@app/repositories';

@EntityRepository(UserEntity)
export class UsersRepository extends GeneralRepository<UserEntity> {
  protected entitySerializer = UserEntity;

  public async findUsersByEmails(emails: string[]): Promise<UserEntity[]> {
    if (!emails.length) return [];
    return this.createQueryBuilder('u')
      .where('u.email IN (:...emails)', { emails })
      .orderBy('u.id')
      .getMany();
  }
}
