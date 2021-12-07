import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { plainToClass } from 'class-transformer';
import {
  ExceptionsUnprocessableEntity,
  ExceptionsForbidden,
} from '@app/exceptions/errors';
import { SignInRequestBodyDTO, SignInResponseBodyDTO } from '../dtos';
import { AUTH_ERRORS } from '@app/constants';
import { comparePasswords } from '../helpers';
import { ENTITIES_FIELDS } from '@app/constants';
import { USER_EXPOSE_GROUPS } from '../../users/constants';
import { AuthGeneralService } from './auth-general.service';
import { EntityFinderGeneralService } from '../../entity-finder/services';
import { isMember } from '../../users/helpers';

@Injectable()
export class AuthSignInService {
  constructor(
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: SignInRequestBodyDTO): Promise<SignInResponseBodyDTO> {
    const user = await this.entityFinderGeneralService.getFullUserOrFail(
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
      throw new ExceptionsForbidden([
        {
          field: ENTITIES_FIELDS.EMAIL,
          messages: [AUTH_ERRORS.EMAIL_NOT_CONFIRMED],
        },
      ]);
    }
  }

  public static async checkComparePasswordsOrFail(
    passwordToCheck: string,
    originalPassword: string,
    exceptionField: string = ENTITIES_FIELDS.PASSWORD,
  ): Promise<void> {
    const passwordIsCompare = await comparePasswords(
      passwordToCheck,
      originalPassword,
    );
    if (passwordIsCompare) return;

    throw new ExceptionsUnprocessableEntity([
      {
        field: exceptionField,
        messages: [AUTH_ERRORS.INVALID_PASSWORD],
      },
    ]);
  }
}
