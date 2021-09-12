import { Injectable } from '@nestjs/common';
import { UserRepository } from '@app/auth/repositories/user.repository';
import { UnprocessableEntity } from '@app/exceptions';
import { AUTH_ERRORS } from '@app/constants';
import { EmailConfirmed, PasswordRecovery, User } from '@app/entities';
import { Connection } from 'typeorm';

@Injectable()
export class CommonAuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly connection: Connection,
  ) {}

  async deleteUser(id: number) {
    const user = await this.userRepository.findOne({ id });

    if (!user) {
      throw new UnprocessableEntity([
        { field: 'id', message: AUTH_ERRORS.USER_NOT_FOUND },
      ]);
    }

    await this.connection.transaction(async (manager) => {
      await manager.delete(EmailConfirmed, { email: user.email });
      await manager.delete(PasswordRecovery, { email: user.email });
      await manager.delete(User, { id });
    });
  }
}
