import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AuthEmailConfirmedRepository } from '../repositories';
import { EmailConfirmationRequestBodyDTO } from '../dtos';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '../constants';
import { ENTITIES_FIELDS } from '@app/constants';
import { UsersRepository } from '../../users/repositories';

@Injectable()
export class AuthEmailConfirmedService {
  constructor(
    private readonly authEmailConfirmedRepository: AuthEmailConfirmedRepository,
    private readonly usersRepository: UsersRepository,
    private readonly connection: Connection,
  ) {}

  async emailConfirmation(
    body: EmailConfirmationRequestBodyDTO,
  ): Promise<void> {
    const record = await this.authEmailConfirmedRepository.findByTokenOrFail(
      body.token,
    );

    const member = await this.usersRepository.getMemberOrFail({
      email: record.email,
    });
    if (member.emailConfirmed) {
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
      await authEmailConfirmedRepository.deleteEntity(record.id);

      const usersRepository = manager.getCustomRepository(UsersRepository);
      await usersRepository.updateEntity(
        { email: record.email },
        { emailConfirmed: true },
      );
    });
  }
}
