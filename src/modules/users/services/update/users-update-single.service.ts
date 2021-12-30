import { Injectable } from '@nestjs/common';
import {
  UsersEmailConfirmedRepository,
  UsersRepository,
} from '../../repositories';
import { Connection } from 'typeorm';
import { TUserDTO } from '../../types';
import { AUTH_ERRORS } from '@app/constants';
import { EntityFinderGeneralService } from '../../../entity-finder/services';
import { UsersUpdateSingleRequestBodyDTO } from '../../dtos/users-update-single.dtos';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { generateRandomToken, isUndefined } from '@app/helpers';
import { USER_EXPOSE_GROUPS } from '../../constants';
import { RequiredField } from '@app/types';
import { AuthSignInService } from '../../../auth/services';
import { UserEntity } from '@app/entities';
import { getHashByPassword } from '../../../auth/helpers';
import { UsersSendingMailService } from '../users-sending-mail.service';

interface IExecuteOrFailReturn {
  user: TUserDTO;
  canBeLogout: boolean;
}

@Injectable()
export class UsersUpdateSingleService {
  constructor(
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
    private readonly usersRepository: UsersRepository,
    private readonly usersSendingMailService: UsersSendingMailService,
    private readonly connection: Connection,
  ) {}

  public async executeOrFail(
    userId: number,
    body: UsersUpdateSingleRequestBodyDTO,
  ): Promise<IExecuteOrFailReturn> {
    const curUser = await this.checkUserBeforeUpdate(userId, body);
    return this.updateUser(curUser, body);
  }

  private async checkUserBeforeUpdate(
    userId: number,
    body: UsersUpdateSingleRequestBodyDTO,
  ): Promise<RequiredField<TUserDTO, 'password'>> {
    const user = (await this.entityFinderGeneralService.getFullUserOrFail(
      {
        id: userId,
      },
      { groups: [USER_EXPOSE_GROUPS.PASSWORD] },
    )) as RequiredField<TUserDTO, 'password'>;

    if (!isUndefined(body.email)) {
      await this.checkEmailOrFail(user.email, body.email);
    }

    if (!isUndefined(body.newPassword) && !isUndefined(body.curPassword)) {
      await AuthSignInService.checkComparePasswordsOrFail(
        body.curPassword,
        user.password,
        'curPassword',
      );
    }

    return user;
  }

  private async checkEmailOrFail(
    curEmail: string,
    newEmail: string,
  ): Promise<void> {
    if (curEmail === newEmail) {
      return;
    }

    await this.usersRepository.getOneAndFail(
      { email: newEmail },
      {
        exception: {
          type: ExceptionsUnprocessableEntity,
          messages: [
            {
              field: 'email',
              messages: [AUTH_ERRORS.EMAIL_IS_EXIST],
            },
          ],
        },
      },
    );
  }

  private async updateUser(
    curUser: UserEntity,
    body: UsersUpdateSingleRequestBodyDTO,
  ): Promise<IExecuteOrFailReturn> {
    const newUser: Partial<UserEntity> = {};
    let canBeLogout = false;

    if (body.name) {
      newUser.name = body.name;
    }

    const isNewEmail = !isUndefined(body.email) && body.email !== curUser.email;
    if (isNewEmail) {
      newUser.email = body.email;
      newUser.emailConfirmed = false;
      canBeLogout = true;
    }

    if (body.newPassword) {
      newUser.password = await getHashByPassword(body.newPassword);
      canBeLogout = true;
    }

    await this.connection.transaction(async (manager) => {
      const usersRepository = manager.getCustomRepository(UsersRepository);
      await usersRepository.updateEntity({ id: curUser.id }, newUser);

      if (isNewEmail) {
        await this.sendMailAfterUpdateUser(
          body.email!,
          manager.getCustomRepository(UsersEmailConfirmedRepository),
        );
      }
    });

    const user = await this.entityFinderGeneralService.getFullUserOrFail({
      id: curUser.id,
    });

    return {
      user,
      canBeLogout,
    };
  }

  private async sendMailAfterUpdateUser(
    email: string,
    usersEmailConfirmedRepository: UsersEmailConfirmedRepository,
  ): Promise<void> {
    const { token } = await usersEmailConfirmedRepository.saveEntity({
      email,
      token: await generateRandomToken(),
    });

    await this.usersSendingMailService.sendMailToConfirmEmail(email, token);
  }
}
