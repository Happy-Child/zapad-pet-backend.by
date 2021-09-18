import config from 'config';
import nodemailer from 'nodemailer';
import { Provider } from '@nestjs/common';
import { SendMailOptionsType } from '@app/mail-sender/types';
import { MAIL_SENDER_PROVIDER_NAME } from '@app/mail-sender/constants';

export class MailSenderGeneralConnector {
  private transporter!: nodemailer.Transporter;

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

  async sendMail(options: SendMailOptionsType): Promise<void> {
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
