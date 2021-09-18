import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { User } from '@app/entities';
import {
  AuthEmailConfirmedRepository,
  AuthUserRepository,
} from '@app/auth/repositories';
import { EmailConfirmationRequestBodyDTO } from '@app/auth/dtos';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/auth/constants';
import { EmailConfirmed } from '@app/auth/entities';

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
      throw new ExceptionsUnprocessableEntity([
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
