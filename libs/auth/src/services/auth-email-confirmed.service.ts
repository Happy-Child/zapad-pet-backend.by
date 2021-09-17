import { Injectable } from '@nestjs/common';
import {
  AuthEmailConfirmedRepository,
  EmailConfirmationRequestBodyDTO,
  AuthUserRepository,
  EmailConfirmed,
  AUTH_ERRORS,
} from '@app/auth';
import { UnprocessableEntity } from '@app/exceptions';
import { Connection } from 'typeorm';
import { User } from '../../../../src/modules/users';

@Injectable()
export class AuthEmailConfirmedService {
  constructor(
    private readonly emailConfirmedRepository: AuthEmailConfirmedRepository,
    private readonly authUserRepository: AuthUserRepository,
    private readonly connection: Connection,
  ) {}

  async emailConfirmation(
    body: EmailConfirmationRequestBodyDTO,
  ): Promise<void> {
    const emailConfirmationData =
      await this.emailConfirmedRepository.findByTokenOrFail(body.token);

    const user = await this.authUserRepository.findByEmailOrFail(
      emailConfirmationData.email,
    );
    if (user.emailConfirmed) {
      throw new UnprocessableEntity([
        { field: 'email', message: AUTH_ERRORS.EMAIL_IS_ALREADY_CONFIRMED },
      ]);
    }

    await this.connection.transaction(async (manager) => {
      await manager.delete(EmailConfirmed, {
        id: emailConfirmationData.id,
      });
      await manager.save(User, { ...user, emailConfirmed: true });
    });
  }
}
