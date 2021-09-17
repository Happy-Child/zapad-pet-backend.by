import {
  Controller,
  Post,
  Body,
  Res,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  COOKIE,
  getCookieExpiration,
  SignUpRequestBodyDTO,
  SignInRequestBodyDTO,
  CreateNewPasswordRequestBodyDTO,
  PasswordRecoveryRequestBodyDTO,
  PasswordRecoveryResponseBodyDTO,
  EmailConfirmationRequestBodyDTO,
  AuthSignInService,
  AuthPasswordRecoveryService,
  AuthEmailConfirmedService,
  AuthSignUpService,
} from '@app/auth';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authSignUpService: AuthSignUpService,
    private readonly authSignInService: AuthSignInService,
    private readonly authEmailConfirmedService: AuthEmailConfirmedService,
    private readonly authPasswordRecoveryService: AuthPasswordRecoveryService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/sign-up')
  async signUp(@Body() body: SignUpRequestBodyDTO): Promise<true> {
    await this.authSignUpService.signUp(body);
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/sign-in')
  async signIn(
    @Body() body: SignInRequestBodyDTO,
    @Res() res: any,
  ): Promise<void> {
    const response = await this.authSignInService.signIn(body);
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
    await this.authEmailConfirmedService.emailConfirmation(body);
    return true;
  }

  @HttpCode(HttpStatus.OK)
  @Post('/password-recovery')
  async passwordRecovery(
    @Body() body: PasswordRecoveryRequestBodyDTO,
  ): Promise<PasswordRecoveryResponseBodyDTO> {
    return this.authPasswordRecoveryService.passwordRecovery(body);
  }

  @HttpCode(HttpStatus.OK)
  @Post('/create-new-password')
  async createNewPassword(
    @Body() body: CreateNewPasswordRequestBodyDTO,
  ): Promise<true> {
    await this.authPasswordRecoveryService.createNewPassword(body);
    return true;
  }
}
