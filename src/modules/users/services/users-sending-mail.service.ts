import config from 'config';
import { Injectable } from '@nestjs/common';
import { PugGeneralService } from '@app/pug/services';
import { MailSenderGeneralService } from '@app/mail-sender/services';
import { PUG_TEMPLATES_NAMES } from '@app/pug/constants';
import { UserEntity } from '@app/entities';
import { generateRandomToken } from '@app/helpers';
import { UsersEmailConfirmedRepository } from '../repositories';
import { UsersCreateGeneralUserDTO } from '../dtos';

@Injectable()
export class UsersSendingMailService {
  constructor(
    private readonly mailSenderGeneralService: MailSenderGeneralService,
    private readonly pugGeneralService: PugGeneralService,
  ) {}

  public async sendingEmailsCreatedUsers(
    users: { email: string }[],
    usersEmailConfirmedRepository: UsersEmailConfirmedRepository,
  ): Promise<void> {
    const recordsToEmailConfirmation = await Promise.all(
      users.map(async ({ email }) => ({
        token: await generateRandomToken(),
        email,
      })),
    );

    const recordsOfConfirmationEmails =
      await usersEmailConfirmedRepository.saveEntities(
        recordsToEmailConfirmation,
      );

    const dataToSendingEmails = recordsOfConfirmationEmails.map((record) => {
      const user = users.find(
        ({ email: userEmail }) => userEmail === record.email,
      ) as UsersCreateGeneralUserDTO;
      return { user, token: record.token };
    });

    await Promise.all(
      dataToSendingEmails.map(async ({ token, user }) =>
        this.sendEmailAfterCreatedUser(user, token),
      ),
    );
  }

  private async sendEmailAfterCreatedUser(
    user: Pick<Required<UserEntity>, 'email' | 'name' | 'password'>,
    token: string,
  ): Promise<void> {
    const href = `${config.FRONT_URLS.CONFIRMED_REGISTRATION}?token=${token}`;
    const html = this.pugGeneralService.compileFile(
      PUG_TEMPLATES_NAMES.AFTER_CREATED_USER,
      { name: user.name, password: user.password, href },
    );
    await this.mailSenderGeneralService.sendMail({ to: user.email, html });
  }
}
