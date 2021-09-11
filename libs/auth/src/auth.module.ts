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
import * as fs from 'fs';
import * as config from 'config';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '@app/auth/strategies/jwt.strategy';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserRepository, EmailConfirmedRepository]),
    JwtModule.register({
      privateKey: fs.readFileSync(config.RSA.PRIVATE_KEY_PATH).toString(),
      publicKey: fs.readFileSync(config.RSA.PUBLIC_KEY_PATH).toString(),
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
