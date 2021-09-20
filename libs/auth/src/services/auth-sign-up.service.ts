import { Injectable } from '@nestjs/common';
import { generateRandomToken } from '@app/helpers';
import { Connection } from 'typeorm';
import { User } from '@app/entities';
import { getHashByPassword } from '@app/auth/helpers';
import {
  AuthEmailConfirmedRepository,
  AuthUserRepository,
} from '@app/auth/repositories';
import { AuthSendingMailService } from '@app/auth/services/auth-sending-mail.service';
import { SignUpRequestBodyDTO } from '@app/auth/dtos';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/auth/constants';
import { EmailConfirmed } from '@app/auth/entities';

@Injectable()
export class AuthSignUpService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly sendingMailService: AuthSendingMailService,
    private readonly emailConfirmedRepository: AuthEmailConfirmedRepository,
    private readonly connection: Connection,
  ) {}

  async signUp(body: SignUpRequestBodyDTO): Promise<boolean> {
    await this.checkEmailOrFail(body.email);
    await this.saveUserAndSendMessage(body);
    return true;
  }

  private async checkEmailOrFail(email: string): Promise<void> {
    const user = await this.authUserRepository.findByEmail(email);

    if (user) {
      throw new ExceptionsUnprocessableEntity([
        { field: 'email', messages: [AUTH_ERRORS.EMAIL_IS_EXIST] },
      ]);
    }
  }

  private async saveUserAndSendMessage(
    body: SignUpRequestBodyDTO,
  ): Promise<void> {
    const passwordHash = await getHashByPassword(body.password);
    const user = this.authUserRepository.create({
      name: body.name,
      email: body.email,
      role: body.role,
      password: passwordHash,
    });

    const token = await generateRandomToken();
    await this.sendingMailService.sendEmailConfirmingSignUp({ user, token });

    await this.connection.transaction(async (manager) => {
      await manager.save(EmailConfirmed, { email: user.email, token });
      await manager.save(User, user);
    });
  }
}
