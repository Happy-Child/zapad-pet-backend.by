import config from 'config';
import { Injectable } from '@nestjs/common';
import { PugGeneralService } from '@app/pug/services';
import { MailSenderGeneralService } from '@app/mail-sender/services';
import { PUG_TEMPLATES_NAMES } from '@app/pug/constants';

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
