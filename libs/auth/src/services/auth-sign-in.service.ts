import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from '@app/auth/helpers';
import { AuthUserRepository } from '@app/auth/repositories';
import { SignInRequestBodyDTO, SignInResponseBodyDTO } from '@app/auth/dtos';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/auth/constants';
import { ENTITIES_FIELDS } from '@app/entities';
import { IUser } from '@app/user';

@Injectable()
export class AuthSignInService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: SignInRequestBodyDTO): Promise<SignInResponseBodyDTO> {
    const user = await this.authUserRepository.findWithPasswordByEmailOrFail(
      body.email,
    );

    this.checkEmailConfirmedOrFail(user);
    await this.checkComparePasswordsOrFail(body.password, user.password);

    const accessToken = this.jwtService.sign({ sub: user.id, role: user.role });
    return new SignInResponseBodyDTO({ user, accessToken });
  }

  private checkEmailConfirmedOrFail(user: IUser): void {
    if (!user.emailConfirmed) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: ENTITIES_FIELDS.EMAIL,
          messages: [AUTH_ERRORS.EMAIL_NOT_CONFIRMED],
        },
      ]);
    }
  }

  private async checkComparePasswordsOrFail(
    password: string,
    curPassword: string,
  ): Promise<void> {
    const passwordIsCompare = await comparePasswords(password, curPassword);
    if (!passwordIsCompare) {
      throw new ExceptionsUnprocessableEntity([
        {
          field: ENTITIES_FIELDS.PASSWORD,
          messages: [AUTH_ERRORS.INVALID_PASSWORD],
        },
      ]);
    }
  }
}
