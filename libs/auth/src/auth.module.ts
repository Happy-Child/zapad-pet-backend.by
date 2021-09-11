import { Module } from '@nestjs/common';
import {
  SignInService,
  SignUpService,
  EmailConfirmedService,
  PasswordRecoveryService,
  CommonAuthService,
} from './services';
import { AuthController } from './controllers/auth.controller';
import { UserRepository } from '@app/auth/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([UserRepository])],
  providers: [
    SignInService,
    SignUpService,
    EmailConfirmedService,
    PasswordRecoveryService,
    CommonAuthService,
  ],
  controllers: [AuthController],
})
export class AuthModule {}
