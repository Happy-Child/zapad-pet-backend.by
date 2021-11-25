import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import { AuthEmailConfirmedRepository } from '../repositories';
import { EmailConfirmationRequestBodyDTO } from '../dtos';
import {
  ExceptionsUnprocessableEntity,
  ExceptionsNotFound,
} from '@app/exceptions/errors';
import { AUTH_ERRORS } from '../constants';
import { UsersRepository } from '../../users/repositories';
import { EntityFinderGeneralService } from '../../entity-finder/services';

@Injectable()
export class AuthEmailConfirmedService {
  constructor(
    private readonly authEmailConfirmedRepository: AuthEmailConfirmedRepository,
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
    private readonly connection: Connection,
  ) {}

  async emailConfirmation(
    body: EmailConfirmationRequestBodyDTO,
  ): Promise<void> {
    const record = await this.authEmailConfirmedRepository.getOneOrFail(
      { token: body.token },
      {
        exception: {
          type: ExceptionsNotFound,
          messages: [
            {
              field: 'token',
              messages: [AUTH_ERRORS.TOKEN_NOT_FOUND],
            },
          ],
        },
      },
    );

    const user = await this.entityFinderGeneralService.getFullUserOrFail({
      email: record.email,
    });
    if (user.emailConfirmed) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: 'email',
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
