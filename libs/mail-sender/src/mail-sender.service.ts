import { Inject, Injectable } from '@nestjs/common';
import { MAIL_SENDER_PROVIDER_NAME, SendMailOptions } from '@app/mail-sender';
import { MailSenderConnector } from '@app/mail-sender/mail-sender.connector';

@Injectable()
export class MailSenderService {
  constructor(
    @Inject(MAIL_SENDER_PROVIDER_NAME)
    private readonly mailSenderConnector: MailSenderConnector,
  ) {}

  async sendMail(options: SendMailOptions): Promise<void> {
    await this.mailSenderConnector.sendMail(options);
  }
}
