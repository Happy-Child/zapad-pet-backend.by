import { Module } from '@nestjs/common';
import {
  SignInService,
  SignUpService,
  EmailConfirmedService,
  PasswordRecoveryService,
  CommonAuthService,
  SendingMailService,
} from './services';
import { AuthController } from './controllers/auth.controller';
import { UserRepository } from '@app/auth/repositories/user.repository';
import { EmailConfirmedRepository } from '@app/auth/repositories/email-confirmed.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailSenderModule } from '@app/mail-sender';
import { PugModule } from '@app/pug';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, EmailConfirmedRepository]),
    MailSenderModule,
    PugModule,
  ],
  providers: [
    SignInService,
    SignUpService,
    EmailConfirmedService,
    PasswordRecoveryService,
    CommonAuthService,
    SendingMailService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
