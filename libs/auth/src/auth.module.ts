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
import { UserRepository } from '@app/repositories/user.repository';
import { EmailConfirmedRepository } from '@app/auth/repositories/email-confirmed.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailSenderModule } from '@app/mail-sender';
import { PugModule } from '@app/pug';
import config from 'config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';
import { PasswordRecoveryRepository } from '@app/auth/repositories/password-recovery.repository';
import { readFile } from '@app/helpers';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UserRepository,
      EmailConfirmedRepository,
      PasswordRecoveryRepository,
    ]),
    JwtModule.register({
      privateKey: readFile(config.RSA.PRIVATE_KEY_PATH).toString(),
      publicKey: readFile(config.RSA.PUBLIC_KEY_PATH).toString(),
      signOptions: {
        algorithm: config.JWT.ALGORITHM,
        expiresIn: config.JWT.EXPIRATION,
      },
    }),
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
    JwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
