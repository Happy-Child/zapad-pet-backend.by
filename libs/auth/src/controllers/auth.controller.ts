import {
  Controller,
  Post,
  Body,
  Delete,
  Param,
  ParseIntPipe,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  CommonAuthService,
  EmailConfirmedService,
  PasswordRecoveryService,
  SignInService,
  SignUpService,
} from '@app/auth/services';
import { SignUpRequestBodyDTO } from '@app/auth/dtos/sign-up.dtos';
import { SignInRequestBodyDTO } from '@app/auth/dtos/sign-in.dtos';
import { getCookieExpiration } from '@app/auth/helpers/cookies.helpers';
import { EmailConfirmationRequestBodyDTO } from '@app/auth/dtos/email-confirmation.dtos';
import {
  CreateNewPasswordRequestBodyDTO,
  PasswordRecoveryRequestBodyDTO,
  PasswordRecoveryResponseBodyDTO,
} from '@app/auth/dtos/password-recovery.dtos';
import { COOKIE } from '@app/auth/constants/auth.constants';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpService: SignUpService,
    private readonly signInService: SignInService,
    private readonly commonAuthService: CommonAuthService,
    private readonly emailConfirmedService: EmailConfirmedService,
    private readonly passwordRecoveryService: PasswordRecoveryService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/sign-up')
  async signUp(@Body() body: SignUpRequestBodyDTO): Promise<true> {
    await this.signUpService.signUp(body);
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signIn(
    @Body() body: SignInRequestBodyDTO,
    @Res() res: any,
  ): Promise<void> {
    const response = await this.signInService.signIn(body);
    res.cookie(COOKIE.ACCESS_TOKEN, response.accessToken, {
      ...COOKIE.SECURE_OPTIONS,
      expires: getCookieExpiration(),
    });
    res.send(response);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/email-confirmation')
  async emailConfirmation(
    @Body() body: EmailConfirmationRequestBodyDTO,
  ): Promise<true> {
    await this.emailConfirmedService.emailConfirmation(body);
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/password-recovery')
  async passwordRecovery(
    @Body() body: PasswordRecoveryRequestBodyDTO,
  ): Promise<PasswordRecoveryResponseBodyDTO> {
    return this.passwordRecoveryService.passwordRecovery(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/create-new-password')
  async createNewPassword(
    @Body() body: CreateNewPasswordRequestBodyDTO,
  ): Promise<true> {
    await this.passwordRecoveryService.createNewPassword(body);
    return true;
  }

  // move to users module
  @Delete('/delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<true> {
    await this.commonAuthService.deleteUser(id);
    return true;
  }
}
