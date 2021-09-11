import { Injectable } from '@nestjs/common';
import { UserRepository } from '@app/auth/repositories/user.repository';
import { UnprocessableEntity } from '@app/exceptions';
import { AUTH_ERRORS } from '@app/constants';

@Injectable()
export class CommonAuthService {
  constructor(private readonly userRepository: UserRepository) {}

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new UnprocessableEntity([
        { field: 'id', message: AUTH_ERRORS.USER_NOT_FOUND },
      ]);
    }

    await this.userRepository.delete({ id });
  }
}
