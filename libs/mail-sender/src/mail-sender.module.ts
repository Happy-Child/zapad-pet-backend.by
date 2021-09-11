import { Module } from '@nestjs/common';
import { MailSenderService } from './mail-sender.service';
import MailSenderConnector from './mail-sender.connector';

@Module({
  providers: [MailSenderConnector, MailSenderService],
  exports: [MailSenderService],
})
export class MailSenderModule {}
