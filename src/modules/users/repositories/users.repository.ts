import { EntityRepository } from 'typeorm';
import { UserEntity } from '../entities';
import { GeneralRepository } from '../../../../libs/repositories/src';

@EntityRepository(UserEntity)
export class UsersRepository extends GeneralRepository<UserEntity> {
  async findUsersByEmails(emails: string[]): Promise<UserEntity[]> {
    return this.createQueryBuilder('u')
      .where('u.email IN (:...emails)', { emails })
      .orderBy('u.id')
      .getMany();
  }
}
