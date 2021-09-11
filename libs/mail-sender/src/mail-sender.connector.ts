import * as nodemailer from 'nodemailer';
import { Provider } from '@nestjs/common';
import { MAIL_SENDER_PROVIDER_NAME } from '@app/mail-sender';
import * as config from 'config';
import { SendMailOptions } from '@app/mail-sender/mail-sender.types';

export class MailSenderConnector {
  private transporter: nodemailer.Transporter;

  connect(): void {
    this.transporter = nodemailer.createTransport({
      host: config.MAIL_SENDER.HOST,
      port: config.MAIL_SENDER.PORT,
      secure: config.MAIL_SENDER.SECURE,
      auth: {
        user: config.MAIL_SENDER.USER,
        pass: config.MAIL_SENDER.PASS,
      },
    });
  }

  async sendMail(options: SendMailOptions): Promise<void> {
    const result = await this.transporter.sendMail({
      from: config.MAIL_SENDER.USER,
      to: options.to,
      subject: options.subject,
      text: options.text,
      html: options.html,
    });
    console.log('Message sent: %s', result.messageId);
  }
}

const result: Provider = {
  provide: MAIL_SENDER_PROVIDER_NAME,
  useFactory: async () => {
    const connector = new MailSenderConnector();
    await connector.connect();
    return connector;
  },
};

export default result;
