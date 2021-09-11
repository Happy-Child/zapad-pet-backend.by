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
  SignInService,
  SignUpService,
} from '@app/auth/services';
import { SignUpRequestBodyDTO } from '@app/auth/dtos/sign-up.dtos';
import {
  SignInRequestBodyDTO,
  SignInResponseBodyDTO,
} from '@app/auth/dtos/sign-in.dtos';
import { COOKIE } from '@app/constants';
import { getCookieExpiration } from '@app/auth/helpers/cookies.helpers';
import { EmailConfirmationRequestBodyDTO } from '@app/auth/dtos/email-confirmation.dtos';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly signUpService: SignUpService,
    private readonly signInService: SignInService,
    private readonly commonAuthService: CommonAuthService,
    private readonly emailConfirmedService: EmailConfirmedService,
  ) {}

  @HttpCode(HttpStatus.CREATED)
  @Post('/sign-up')
  async signUp(@Body() body: SignUpRequestBodyDTO): Promise<void> {
    await this.signUpService.signUp(body);
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
    res.send(new SignInResponseBodyDTO(response));
  }

  @HttpCode(HttpStatus.OK)
  @Post('/email-confirmation')
  async emailConfirmation(
    @Body() body: EmailConfirmationRequestBodyDTO,
  ): Promise<true> {
    await this.emailConfirmedService.emailConfirmation(body);
    return true;
  }

  // move to users module
  @Delete('/delete/:id')
  async delete(@Param('id', ParseIntPipe) id: number): Promise<true> {
    await this.commonAuthService.deleteUser(id);
    return true;
  }
}
