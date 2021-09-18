import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import {
  CreateNewPasswordRequestBodyDTO,
  PasswordRecoveryRequestBodyDTO,
  PasswordRecoveryResponseBodyDTO,
} from '@app/auth/dtos';
import { generateRandomToken } from '@app/helpers';
import { User } from '@app/entities';
import { checkTimeAllowedSendMail, getHashByPassword } from '@app/auth/helpers';
import {
  AuthPasswordRecoveryRepository,
  AuthUserRepository,
} from '@app/auth/repositories';
import { AuthSendingMailService } from '@app/auth/services/auth-sending-mail.service';
import { PasswordRecovery } from '@app/auth/entities';

@Injectable()
export class AuthPasswordRecoveryService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly authPasswordRecoveryRepository: AuthPasswordRecoveryRepository,
    private readonly authSendingMailService: AuthSendingMailService,
    private readonly connection: Connection,
  ) {}

  async passwordRecovery({
    email,
  }: PasswordRecoveryRequestBodyDTO): Promise<PasswordRecoveryResponseBodyDTO> {
    await this.authUserRepository.findByEmailOrFail(email);

    const prevPasswordRecoveryData =
      await this.authPasswordRecoveryRepository.findOne({
        email,
      });

    return !prevPasswordRecoveryData
      ? this.sendFirstEmailRecoveryPassword(email)
      : this.checkAttemptCountAndSendEmailRecoveryPassword(
          prevPasswordRecoveryData,
        );
  }

  private async sendFirstEmailRecoveryPassword(
    email: string,
  ): Promise<PasswordRecoveryResponseBodyDTO> {
    const token = await generateRandomToken();

    await this.authSendingMailService.sendEmailRecoveryPassword({
      email,
      token,
    });

    const { attemptCount, updatedAt } =
      await this.authPasswordRecoveryRepository.save({
        token,
        email,
        attemptCount: 1,
      });

    return new PasswordRecoveryResponseBodyDTO({
      attemptCount,
      updatedAt,
      wasSent: true,
    });
  }

  private async checkAttemptCountAndSendEmailRecoveryPassword(
    prevPasswordRecoveryData: PasswordRecovery,
  ): Promise<PasswordRecoveryResponseBodyDTO> {
    const { id, email, token, attemptCount, updatedAt } =
      prevPasswordRecoveryData;

    const allowedSendMail = checkTimeAllowedSendMail({
      time: updatedAt,
      attemptCount,
    });

    if (allowedSendMail) {
      await this.authSendingMailService.sendEmailRecoveryPassword({
        email,
        token,
      });

      await this.authPasswordRecoveryRepository.update(id, {
        attemptCount: attemptCount + 1,
      });

      const updatedPasswordRecoveryData =
        (await this.authPasswordRecoveryRepository.findOne(
          id,
        )) as PasswordRecovery;

      return new PasswordRecoveryResponseBodyDTO({
        attemptCount: updatedPasswordRecoveryData.attemptCount,
        updatedAt: updatedPasswordRecoveryData.updatedAt,
        wasSent: true,
      });
    }

    return new PasswordRecoveryResponseBodyDTO({
      attemptCount,
      updatedAt,
      wasSent: false,
    });
  }

  async createNewPassword(
    body: CreateNewPasswordRequestBodyDTO,
  ): Promise<void> {
    const passwordRecoveryData =
      await this.authPasswordRecoveryRepository.findByTokenOrFail(body.token);

    const user = await this.authUserRepository.findByEmailOrFail(
      passwordRecoveryData.email,
    );

    const newPasswordHash = await getHashByPassword(body.password);

    await this.connection.transaction(async (manager) => {
      await manager.delete(PasswordRecovery, { id: passwordRecoveryData.id });
      await manager.update(
        User,
        { id: user.id },
        { password: newPasswordHash },
      );
    });
  }
}
