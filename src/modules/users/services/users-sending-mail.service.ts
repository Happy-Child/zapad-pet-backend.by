import config from 'config';
import { Injectable } from '@nestjs/common';
import { PugGeneralService } from '@app/pug/services';
import { MailSenderGeneralService } from '@app/mail-sender/services';
import { PUG_TEMPLATES_NAMES } from '@app/pug/constants';
import { UserEntity } from '../entities';
import { ENTITIES_FIELDS } from '@app/entities';

interface ISendEmailConfirmingSignUpOptions {
  user: Pick<
    UserEntity,
    ENTITIES_FIELDS.EMAIL | ENTITIES_FIELDS.NAME | ENTITIES_FIELDS.PASSWORD
  >;
  token: string;
}

@Injectable()
export class UsersSendingMailService {
  constructor(
    private readonly mailSenderGeneralService: MailSenderGeneralService,
    private readonly pugGeneralService: PugGeneralService,
  ) {}

  async sendEmailsAfterCreatedUser({
    user,
    token,
  }: ISendEmailConfirmingSignUpOptions): Promise<void> {
    const href = `${config.FRONT_URLS.CONFIRMED_REGISTRATION}?token=${token}`;
    const html = this.pugGeneralService.compileFile(
      PUG_TEMPLATES_NAMES.AFTER_CREATED_USER,
      { name: user.name, password: user.password, href },
    );
    await this.mailSenderGeneralService.sendMail({ to: user.email, html });
  }
}
