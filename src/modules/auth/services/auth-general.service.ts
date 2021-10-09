import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../users/entities';
import { UsersRepository } from '../../users/repositories';

@Injectable()
export class AuthGeneralService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async me(id: number): Promise<UserEntity> {
    return this.usersRepository.getMemberOrFail({ id });
  }
}
