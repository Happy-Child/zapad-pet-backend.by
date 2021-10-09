import {
  Controller,
  Post,
  Body,
  Res,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  UseGuards,
  Query,
} from '@nestjs/common';
import { getCookieExpiration } from '../helpers';
import {
  AuthEmailConfirmedService,
  AuthGeneralService,
  AuthPasswordRecoveryService,
  AuthSignInService,
} from '../services';
import {
  CreateNewPasswordRequestBodyDTO,
  EmailConfirmationRequestBodyDTO,
  PasswordRecoveryRequestBodyDTO,
  PasswordRecoveryResponseBodyDTO,
  SignInRequestBodyDTO,
  SimpleUserJWTPayloadDTO,
} from '../dtos';
import { COOKIE } from '../constants';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { TMemberDTO } from '../../users/types';
import { SimpleUserDTO } from '../../users/dtos';
import { TMemberJWTPayloadDTO } from '../types';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authSignInService: AuthSignInService,
    private readonly authEmailConfirmedService: AuthEmailConfirmedService,
    private readonly authPasswordRecoveryService: AuthPasswordRecoveryService,
    private readonly authGeneralService: AuthGeneralService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard)
  @Get('/me')
  async me(
    @Request()
    { user }: { user: TMemberJWTPayloadDTO | SimpleUserJWTPayloadDTO },
  ): Promise<TMemberDTO | SimpleUserDTO> {
    return this.authGeneralService.me(user.userId);
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
  @Get('/password-recovery')
  async passwordRecovery(
    @Query() query: PasswordRecoveryRequestBodyDTO,
  ): Promise<PasswordRecoveryResponseBodyDTO> {
    return this.authPasswordRecoveryService.passwordRecovery(query.email);
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
