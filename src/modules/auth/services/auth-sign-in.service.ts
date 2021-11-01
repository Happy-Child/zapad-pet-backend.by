import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { SignInRequestBodyDTO, SignInResponseBodyDTO } from '../dtos';
import { AUTH_ERRORS } from '../constants';
import { comparePasswords } from '../helpers';
import { ENTITIES_FIELDS } from '@app/constants';
import { USER_EXPOSE_GROUPS } from '../../users/constants';
import { isMember } from '../../users/helpers';
import { UsersGettingService } from '../../users/services';
import { AuthGeneralService } from './auth-general.service';

@Injectable()
export class AuthSignInService {
  constructor(
    private readonly usersGettingService: UsersGettingService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: SignInRequestBodyDTO): Promise<SignInResponseBodyDTO> {
    const user = await this.usersGettingService.getFullUserOrFail(
      {
        email: body.email,
      },
      { groups: [USER_EXPOSE_GROUPS.PASSWORD] },
      'email',
    );

    await AuthSignInService.checkComparePasswordsOrFail(
      body.password,
      user.password as string,
    );
    AuthSignInService.checkEmailConfirmedOrFail(user.emailConfirmed);
    if (isMember(user)) AuthGeneralService.isFullMemberOrFail(user);

    const accessToken = this.jwtService.sign({ sub: user.id });
    return plainToClass(SignInResponseBodyDTO, { user, accessToken });
  }

  public static checkEmailConfirmedOrFail(emailConfirmed: boolean): void {
    if (!emailConfirmed) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: ENTITIES_FIELDS.EMAIL,
          messages: [AUTH_ERRORS.EMAIL_NOT_CONFIRMED],
        },
      ]);
    }
  }

  private static async checkComparePasswordsOrFail(
    password: string,
    curPassword: string,
  ): Promise<void> {
    const passwordIsCompare = await comparePasswords(password, curPassword);
    if (passwordIsCompare) return;

    throw new ExceptionsUnprocessableEntity([
      {
        field: ENTITIES_FIELDS.PASSWORD,
        messages: [AUTH_ERRORS.INVALID_PASSWORD],
      },
    ]);
  }
}
