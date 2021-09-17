import { Injectable } from '@nestjs/common';
import {
  EmailConfirmed,
  SignUpRequestBodyDTO,
  AuthUserRepository,
  AuthEmailConfirmedRepository,
  AuthSendingMailService,
  getHashByPassword,
  AUTH_ERRORS,
} from '@app/auth';
import { generateRandomToken } from '@app/helpers';
import { UnprocessableEntity } from '@app/exceptions';
import { Connection } from 'typeorm';
import { User } from '../../../../src/modules/users';

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
      throw new UnprocessableEntity([
        { field: 'email', message: AUTH_ERRORS.EMAIL_IS_EXIST },
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
