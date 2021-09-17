import config from 'config';
import { Injectable } from '@nestjs/common';
import { MailSenderService } from '@app/mail-sender';
import { PUG_TEMPLATES_NAMES, PugService } from '@app/pug';
import { User } from '../../../../src/modules/users';

@Injectable()
export class AuthSendingMailService {
  constructor(
    private readonly mailSenderService: MailSenderService,
    private readonly pugService: PugService,
  ) {}

  async sendEmailConfirmingSignUp({
    user,
    token,
  }: {
    user: User;
    token: string;
  }): Promise<void> {
    const href = `${config.FRONT_URLS.CONFIRMED_REGISTRATION}?token=${token}`;
    const html = this.pugService.compileFile(
      PUG_TEMPLATES_NAMES.CONFIRMING_REGISTRATION,
      { name: user.name, href },
    );
    await this.mailSenderService.sendMail({ to: user.email, html });
  }

  async sendEmailRecoveryPassword({
    email,
    token,
  }: {
    email: string;
    token: string;
  }): Promise<void> {
    const href = `${config.FRONT_URLS.CREATE_NEW_PASSWORD}?token=${token}`;
    const html = this.pugService.compileFile(
      PUG_TEMPLATES_NAMES.CREATE_NEW_PASSWORD,
      { href },
    );
    await this.mailSenderService.sendMail({ to: email, html });
  }
}
