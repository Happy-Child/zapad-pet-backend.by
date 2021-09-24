import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import {
  CreateNewPasswordRequestBodyDTO,
  PasswordRecoveryRequestBodyDTO,
  PasswordRecoveryResponseBodyDTO,
} from '../dtos';
import { generateRandomToken } from '@app/helpers';
import { checkTimeAllowedSendMail, getHashByPassword } from '../helpers';
import {
  AuthPasswordRecoveryRepository,
  AuthUserRepository,
} from '../repositories';
import { AuthSendingMailService } from './auth-sending-mail.service';
import { PasswordRecoveryEntity } from '../entities';

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
      await this.authPasswordRecoveryRepository.getOne({
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
      await this.authPasswordRecoveryRepository.saveEntity({
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
    prevPasswordRecoveryData: PasswordRecoveryEntity,
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

      await this.authPasswordRecoveryRepository.updateEntity(
        { id },
        {
          attemptCount: attemptCount + 1,
        },
      );

      const updatedPasswordRecoveryData =
        (await this.authPasswordRecoveryRepository.getOne({
          id,
        })) as PasswordRecoveryEntity;

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
      const authPasswordRecoveryRepository = manager.getCustomRepository(
        AuthPasswordRecoveryRepository,
      );
      await authPasswordRecoveryRepository.deleteEntity(
        passwordRecoveryData.id,
      );

      const authUserRepository =
        manager.getCustomRepository(AuthUserRepository);
      await authUserRepository.updateEntity(
        { id: user.id },
        { password: newPasswordHash },
      );
    });
  }
}
