import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../../users/repositories';
import { TMemberDTO } from '../../users/types';
import { SimpleUserDTO } from '../../users/dtos';

@Injectable()
export class AuthGeneralService {
  constructor(private readonly usersRepository: UsersRepository) {}

  public async me(id: number): Promise<TMemberDTO | SimpleUserDTO> {
    return this.usersRepository.getFullUserOrFail({ id });
  }
}
