import { Injectable } from '@nestjs/common';
import { MailSenderService } from '@app/mail-sender';
import { PUG_TEMPLATES_NAMES, PugService } from '@app/pug';
import { User } from '@app/entities';
import * as config from 'config';
import { generateRandomToken } from '@app/helpers';
import { EmailConfirmedRepository } from '@app/auth/repositories/email-confirmed.repository';

@Injectable()
export class SendingMailService {
  constructor(
    private readonly mailSenderService: MailSenderService,
    private readonly pugService: PugService,
    private readonly emailConfirmedRepository: EmailConfirmedRepository,
  ) {}

  async sendEmailConfirmingRegistration(user: User): Promise<void> {
    const token = await generateRandomToken();

    const href = `${config.FRONT_URLS.CONFIRMED_REGISTRATION}?token=${token}`;
    const html = this.pugService.compileFile(
      PUG_TEMPLATES_NAMES.CONFIRMING_REGISTRATION,
      { name: user.name, href },
    );

    await this.mailSenderService.sendMail({ to: user.email, html });
    await this.emailConfirmedRepository.save({ email: user.email, token });
  }
}
