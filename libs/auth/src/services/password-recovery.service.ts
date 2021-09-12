import { Injectable } from '@nestjs/common';
import {
  CreateNewPasswordRequestBodyDTO,
  PasswordRecoveryRequestBodyDTO,
  PasswordRecoveryResponseBodyDTO,
} from '@app/auth/dtos/password-recovery.dtos';
import { UserRepository } from '@app/repositories/user.repository';
import { PasswordRecoveryRepository } from '@app/auth/repositories/password-recovery.repository';
import { SendingMailService } from '@app/auth/services/sending-mail.service';
import { getHashByPassword } from '@app/auth/helpers/password.helpers';
import { Connection } from 'typeorm';
import { PasswordRecovery, User } from '@app/entities';
import { generateRandomToken } from '@app/helpers';
import { checkTimeAllowedSendMail } from '@app/auth/helpers/time.helpers';

@Injectable()
export class PasswordRecoveryService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly passwordRecoveryRepository: PasswordRecoveryRepository,
    private readonly sendingMailService: SendingMailService,
    private readonly connection: Connection,
  ) {}

  async passwordRecovery({
    email,
  }: PasswordRecoveryRequestBodyDTO): Promise<PasswordRecoveryResponseBodyDTO> {
    await this.userRepository.findByEmailOrFail(email);

    const prevPasswordRecoveryData =
      await this.passwordRecoveryRepository.findOne({
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

    await this.sendingMailService.sendEmailRecoveryPassword({
      email,
      token,
    });

    const { attemptCount, updatedAt } =
      await this.passwordRecoveryRepository.save({
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
      await this.sendingMailService.sendEmailRecoveryPassword({
        email,
        token,
      });

      await this.passwordRecoveryRepository.update(id, {
        attemptCount: attemptCount + 1,
      });

      const updatedPasswordRecoveryData =
        await this.passwordRecoveryRepository.findOne(id);

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
      await this.passwordRecoveryRepository.findByTokenOrFail(body.token);

    const user = await this.userRepository.findByEmailOrFail(
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
