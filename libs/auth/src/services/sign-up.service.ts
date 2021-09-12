import { Injectable } from '@nestjs/common';
import { SignUpRequestBodyDTO } from '@app/auth/dtos/sign-up.dtos';
import { UserRepository } from '@app/auth/repositories/user.repository';
import { UnprocessableEntity } from '@app/exceptions';
import { AUTH_ERRORS } from '@app/constants';
import { getHashByPassword } from '@app/auth/helpers/password.helpers';
import { SendingMailService } from '@app/auth/services/sending-mail.service';
import { generateRandomToken } from '@app/helpers';
import { EmailConfirmedRepository } from '@app/auth/repositories/email-confirmed.repository';
import { Connection } from 'typeorm';
import { EmailConfirmed, User } from '@app/entities';

@Injectable()
export class SignUpService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly sendingMailService: SendingMailService,
    private readonly emailConfirmedRepository: EmailConfirmedRepository,
    private readonly connection: Connection,
  ) {}

  async signUp(body: SignUpRequestBodyDTO): Promise<boolean> {
    await this.checkEmailOrFail(body.email);
    await this.saveUserAndSendMessage(body);
    return true;
  }

  private async checkEmailOrFail(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

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
    const user = this.userRepository.create({
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
