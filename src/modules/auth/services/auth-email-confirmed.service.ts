import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { ENTITIES_FIELDS } from '@app/entities';
import {
  AuthEmailConfirmedRepository,
  AuthUserRepository,
} from '../repositories';
import { EmailConfirmationRequestBodyDTO } from '../dtos';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '../constants';

@Injectable()
export class AuthEmailConfirmedService {
  constructor(
    private readonly authEmailConfirmedRepository: AuthEmailConfirmedRepository,
    private readonly authUserRepository: AuthUserRepository,
    private readonly connection: Connection,
  ) {}

  async emailConfirmation(
    body: EmailConfirmationRequestBodyDTO,
  ): Promise<void> {
    const emailConfirmationData =
      await this.authEmailConfirmedRepository.findByTokenOrFail(body.token);

    const user = await this.authUserRepository.findByEmailOrFail(
      emailConfirmationData.email,
    );
    if (user.emailConfirmed) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: ENTITIES_FIELDS.EMAIL,
          messages: [AUTH_ERRORS.EMAIL_IS_ALREADY_CONFIRMED],
        },
      ]);
    }

    await this.connection.transaction(async (manager) => {
      const authEmailConfirmedRepository = manager.getCustomRepository(
        AuthEmailConfirmedRepository,
      );
      await authEmailConfirmedRepository.deleteEntity(emailConfirmationData.id);

      const authUserRepository =
        manager.getCustomRepository(AuthUserRepository);
      await authUserRepository.saveEntity({ ...user, emailConfirmed: true });
    });
  }
}
