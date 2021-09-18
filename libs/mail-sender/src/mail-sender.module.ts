import { Module } from '@nestjs/common';
import { MailSenderGeneralProviders } from '@app/mail-sender/providers';
import { MailSenderGeneralService } from '@app/mail-sender/services';

@Module({
  providers: [MailSenderGeneralProviders, MailSenderGeneralService],
  exports: [MailSenderGeneralService],
})
export class MailSenderModule {}
