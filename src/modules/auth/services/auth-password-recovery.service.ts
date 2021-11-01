import { Injectable } from '@nestjs/common';
import { Connection } from 'typeorm';
import {
  CreateNewPasswordRequestBodyDTO,
  PasswordRecoveryResponseBodyDTO,
} from '../dtos';
import { generateRandomToken } from '@app/helpers';
import { checkTimeAllowedSendMail, getHashByPassword } from '../helpers';
import { AuthPasswordRecoveryRepository } from '../repositories';
import { AuthSendingMailService } from './auth-sending-mail.service';
import { PasswordRecoveryEntity } from '@app/entities';
import { UsersRepository } from '../../users/repositories';
import { UsersGettingService } from '../../users/services';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '../constants';

@Injectable()
export class AuthPasswordRecoveryService {
  constructor(
    private readonly usersGettingService: UsersGettingService,
    private readonly authPasswordRecoveryRepository: AuthPasswordRecoveryRepository,
    private readonly authSendingMailService: AuthSendingMailService,
    private readonly connection: Connection,
  ) {}

  async passwordRecovery(
    email: string,
  ): Promise<PasswordRecoveryResponseBodyDTO> {
    await this.usersGettingService.getFullUserOrFail({ email });

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

    const { attemptCount, updatedAt } =
      await this.authPasswordRecoveryRepository.saveEntity({
        token,
        email,
        attemptCount: 1,
      });

    await this.authSendingMailService.sendEmailRecoveryPassword({
      email,
      token,
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
      await this.authPasswordRecoveryRepository.updateEntity(
        { id },
        {
          attemptCount: attemptCount + 1,
        },
      );

      const updatedData = (await this.authPasswordRecoveryRepository.getOne({
        id,
      })) as PasswordRecoveryEntity;

      await this.authSendingMailService.sendEmailRecoveryPassword({
        email,
        token,
      });

      return new PasswordRecoveryResponseBodyDTO({
        attemptCount: updatedData.attemptCount,
        updatedAt: updatedData.updatedAt,
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
      await this.authPasswordRecoveryRepository.getOneOrFail(
        { token: body.token },
        {
          exception: {
            type: ExceptionsUnprocessableEntity,
            messages: [
              {
                field: 'token',
                messages: [AUTH_ERRORS.TOKEN_NOT_FOUND],
              },
            ],
          },
        },
      );

    const user = await this.usersGettingService.getFullUserOrFail({
      email: passwordRecoveryData.email,
    });

    const newPasswordHash = await getHashByPassword(body.password);

    await this.connection.transaction(async (manager) => {
      const usersRepository = manager.getCustomRepository(UsersRepository);
      await usersRepository.updateEntity(
        { id: user.id },
        { password: newPasswordHash },
      );

      const authPasswordRecoveryRepository = manager.getCustomRepository(
        AuthPasswordRecoveryRepository,
      );
      await authPasswordRecoveryRepository.deleteEntity(
        passwordRecoveryData.id,
      );
    });
  }
}
