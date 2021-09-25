import config from 'config';
import { Module } from '@nestjs/common';
import { AuthController } from './controllers/auth.controller';
import {
  AuthEmailConfirmedRepository,
  AuthUserRepository,
  AuthPasswordRecoveryRepository,
} from './repositories';
import {
  AuthSignInService,
  AuthPasswordRecoveryService,
  AuthSendingMailService,
  AuthEmailConfirmedService,
  AuthGeneralService,
} from './services';
import { AuthJwtStrategy } from './strategies';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailSenderModule } from '@app/mail-sender';
import { PugModule } from '@app/pug';
import { JwtModule } from '@nestjs/jwt';
import { readFile } from '@app/helpers';
import {
  DistrictsModule,
  DistrictsRepository,
  DistrictsToEngineersRepository,
} from '../districts';
import { ClientsModule, ClientsToStationWorkersRepository } from '../clients';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      AuthUserRepository,
      AuthEmailConfirmedRepository,
      AuthPasswordRecoveryRepository,
      DistrictsRepository,
      DistrictsToEngineersRepository,
      ClientsToStationWorkersRepository,
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
    DistrictsModule,
    ClientsModule,
  ],
  providers: [
    AuthSignInService,
    AuthEmailConfirmedService,
    AuthPasswordRecoveryService,
    AuthSendingMailService,
    AuthGeneralService,
    AuthJwtStrategy,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
