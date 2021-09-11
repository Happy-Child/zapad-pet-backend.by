import { EntityRepository, Repository } from 'typeorm';
import { User } from '@app/entities';

@EntityRepository(User)
export class UserRepository extends Repository<User> {
  async findByEmail(email: string): Promise<User> {
    return this.findOne({ email });
  }
}
