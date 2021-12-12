import {
  Controller,
  Post,
  Body,
  Res,
  Request,
  Get,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiOkResponse, ApiTags, getSchemaPath } from '@nestjs/swagger';
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
  SignInResponseBodyDTO,
} from '../dtos';
import { COOKIE } from '../constants';
import { TUserDTO } from '../../users/types';
import { TJwtPayloadDTO } from '../types';
import { AuthRoles } from '@app/decorators/auth-roles.decorators';
import { StationWorkerMemberDTO } from '../../stations-workers/dtos';
import { AccountantDTO, MasterDTO } from '../../users/dtos';
import { DistrictLeaderMemberDTO } from '../../districts-leaders/dtos';
import { EngineerMemberDTO } from '../../engineers/dtos';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(
    private readonly authSignInService: AuthSignInService,
    private readonly authEmailConfirmedService: AuthEmailConfirmedService,
    private readonly authPasswordRecoveryService: AuthPasswordRecoveryService,
    private readonly authGeneralService: AuthGeneralService,
  ) {}

  @ApiOkResponse({
    schema: {
      oneOf: [
        { $ref: getSchemaPath(MasterDTO) },
        { $ref: getSchemaPath(StationWorkerMemberDTO) },
        { $ref: getSchemaPath(DistrictLeaderMemberDTO) },
        { $ref: getSchemaPath(EngineerMemberDTO) },
        { $ref: getSchemaPath(AccountantDTO) },
      ],
    },
  })
  @HttpCode(HttpStatus.OK)
  @AuthRoles()
  @Get('/me')
  async me(
    @Request()
    { user }: { user: TJwtPayloadDTO },
  ): Promise<TUserDTO> {
    return this.authGeneralService.me(user.userId);
  }

  @ApiOkResponse({ type: SignInResponseBodyDTO })
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

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @Post('/email-confirmation')
  async emailConfirmation(
    @Body() body: EmailConfirmationRequestBodyDTO,
  ): Promise<true> {
    await this.authEmailConfirmedService.emailConfirmation(body);
    return true;
  }

  @ApiOkResponse({ type: PasswordRecoveryResponseBodyDTO })
  @HttpCode(HttpStatus.OK)
  @Get('/password-recovery')
  async passwordRecovery(
    @Query() query: PasswordRecoveryRequestBodyDTO,
  ): Promise<PasswordRecoveryResponseBodyDTO> {
    return this.authPasswordRecoveryService.passwordRecovery(query.email);
  }

  @ApiOkResponse({ type: Boolean })
  @HttpCode(HttpStatus.OK)
  @Post('/create-new-password')
  async createNewPassword(
    @Body() body: CreateNewPasswordRequestBodyDTO,
  ): Promise<true> {
    await this.authPasswordRecoveryService.createNewPassword(body);
    return true;
  }
}
