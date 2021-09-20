import { Injectable } from '@nestjs/common';
import { generateRandomToken } from '@app/helpers';
import { Connection } from 'typeorm';
import { ENTITIES_FIELDS } from '@app/entities';
import { getHashByPassword } from '@app/auth/helpers';
import {
  AuthEmailConfirmedRepository,
  AuthUserRepository,
} from '@app/auth/repositories';
import { AuthSendingMailService } from '@app/auth/services';
import { SignUpRequestBodyDTO } from '@app/auth/dtos';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/auth/constants';

@Injectable()
export class AuthSignUpService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly sendingMailService: AuthSendingMailService,
    private readonly emailConfirmedRepository: AuthEmailConfirmedRepository,
    private readonly connection: Connection,
  ) {}

  async signUp(body: SignUpRequestBodyDTO): Promise<boolean> {
    await this.checkEmailExistsOrFail(body.email);
    await this.saveUserAndSendMessage(body);
    return true;
  }

  private async checkEmailExistsOrFail(email: string): Promise<void> {
    const user = await this.authUserRepository.findByEmail(email);

    if (user) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: ENTITIES_FIELDS.EMAIL,
          messages: [AUTH_ERRORS.EMAIL_IS_EXIST],
        },
      ]);
    }
  }

  private async saveUserAndSendMessage(
    body: SignUpRequestBodyDTO,
  ): Promise<void> {
    const passwordHash = await getHashByPassword(body.password);
    const user = this.authUserRepository.createEntity({
      name: body.name,
      email: body.email,
      role: body.role,
      password: passwordHash,
    });

    const token = await generateRandomToken();
    await this.sendingMailService.sendEmailConfirmingSignUp({ user, token });

    await this.connection.transaction(async (manager) => {
      const authEmailConfirmedRepository = manager.getCustomRepository(
        AuthEmailConfirmedRepository,
      );
      await authEmailConfirmedRepository.saveEntity({
        email: user.email,
        token,
      });

      const authUserRepository =
        manager.getCustomRepository(AuthUserRepository);
      await authUserRepository.saveEntity(user);
    });
  }
}
