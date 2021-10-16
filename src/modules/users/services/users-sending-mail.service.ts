import config from 'config';
import { Injectable } from '@nestjs/common';
import { PugGeneralService } from '@app/pug/services';
import { MailSenderGeneralService } from '@app/mail-sender/services';
import { PUG_TEMPLATES_NAMES } from '@app/pug/constants';
import { UserEntity } from '@app/entities';

@Injectable()
export class UsersSendingMailService {
  constructor(
    private readonly mailSenderGeneralService: MailSenderGeneralService,
    private readonly pugGeneralService: PugGeneralService,
  ) {}

  async sendEmailAfterCreatedUser(
    user: Pick<Required<UserEntity>, 'email' | 'name' | 'password'>,
    token: string,
  ): Promise<void> {
    const href = `${config.FRONT_URLS.CONFIRMED_REGISTRATION}?token=${token}`;
    const html = this.pugGeneralService.compileFile(
      PUG_TEMPLATES_NAMES.AFTER_CREATED_USER,
      { name: user.name, password: user.password, href },
    );
    await this.mailSenderGeneralService.sendMail({ to: user.email, html });
  }
}
