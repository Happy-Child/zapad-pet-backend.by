import { MailSenderGeneralConnector } from '@app/mail-sender/connectors';
import { MAIL_SENDER_PROVIDER_NAME } from '@app/mail-sender/constants';
import { Provider } from '@nestjs/common';

export const MailSenderGeneralProviders: Provider = {
  provide: MAIL_SENDER_PROVIDER_NAME,
  useFactory: async () => {
    const connector = new MailSenderGeneralConnector();
    await connector.connect();
    return connector;
  },
};
