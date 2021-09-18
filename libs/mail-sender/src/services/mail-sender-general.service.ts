import { Inject, Injectable } from '@nestjs/common';
import { MailSenderGeneralConnector } from '@app/mail-sender/connectors';
import { MAIL_SENDER_PROVIDER_NAME } from '@app/mail-sender/constants';
import { SendMailOptionsType } from '@app/mail-sender/types';

@Injectable()
export class MailSenderGeneralService {
  constructor(
    @Inject(MAIL_SENDER_PROVIDER_NAME)
    private readonly mailSenderGeneralConnector: MailSenderGeneralConnector,
  ) {}

  async sendMail(options: SendMailOptionsType): Promise<void> {
    await this.mailSenderGeneralConnector.sendMail(options);
  }
}
