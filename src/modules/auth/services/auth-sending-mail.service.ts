import config from 'config';
import { Injectable } from '@nestjs/common';
import { PugGeneralService } from '@app/pug/services';
import { MailSenderGeneralService } from '@app/mail-sender/services';
import { PUG_TEMPLATES_NAMES } from '@app/pug/constants';

interface ISendEmailConfirmingSignUpOptions {
  user: {
    email: string;
    name: string;
  };
  token: string;
}

interface ISendEmailRecoveryPasswordOptions {
  email: string;
  token: string;
}

@Injectable()
export class AuthSendingMailService {
  constructor(
    private readonly mailSenderGeneralService: MailSenderGeneralService,
    private readonly pugGeneralService: PugGeneralService,
  ) {}

  async sendEmailConfirmingSignUp({
    user,
    token,
  }: ISendEmailConfirmingSignUpOptions): Promise<void> {
    const href = `${config.FRONT_URLS.CONFIRMED_REGISTRATION}?token=${token}`;
    const html = this.pugGeneralService.compileFile(
      PUG_TEMPLATES_NAMES.CONFIRMING_REGISTRATION,
      { name: user.name, href },
    );
    await this.mailSenderGeneralService.sendMail({ to: user.email, html });
  }

  async sendEmailRecoveryPassword({
    email,
    token,
  }: ISendEmailRecoveryPasswordOptions): Promise<void> {
    const href = `${config.FRONT_URLS.CREATE_NEW_PASSWORD}?token=${token}`;
    const html = this.pugGeneralService.compileFile(
      PUG_TEMPLATES_NAMES.CREATE_NEW_PASSWORD,
      { href },
    );
    await this.mailSenderGeneralService.sendMail({ to: email, html });
  }
}
