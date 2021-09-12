import { Injectable } from '@nestjs/common';
import { EmailConfirmationRequestBodyDTO } from '@app/auth/dtos/email-confirmation.dtos';
import { EmailConfirmedRepository } from '@app/auth/repositories/email-confirmed.repository';
import { UnprocessableEntity } from '@app/exceptions';
import { AUTH_ERRORS } from '@app/constants';
import { UserRepository } from '@app/auth/repositories/user.repository';
import { Connection } from 'typeorm';
import { EmailConfirmed, User } from '@app/entities';

@Injectable()
export class EmailConfirmedService {
  constructor(
    private readonly emailConfirmedRepository: EmailConfirmedRepository,
    private readonly userRepository: UserRepository,
    private readonly connection: Connection,
  ) {}

  async emailConfirmation(
    body: EmailConfirmationRequestBodyDTO,
  ): Promise<void> {
    const emailConfirmationData = await this.emailConfirmedRepository.findOne({
      token: body.token,
    });
    if (!emailConfirmationData) {
      throw new UnprocessableEntity([
        { field: 'token', message: AUTH_ERRORS.TOKEN_NOT_FOUND },
      ]);
    }

    const user = await this.userRepository.findByEmailOrFail(
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
