import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { ENTITIES_FIELDS } from '@app/entities';
import { AuthUserRepository } from '../repositories';
import { SignInRequestBodyDTO, SignInResponseBodyDTO } from '../dtos';
import { AUTH_ERRORS } from '../constants';
import { comparePasswords } from '../helpers';

@Injectable()
export class AuthSignInService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: SignInRequestBodyDTO): Promise<SignInResponseBodyDTO> {
    const user = await this.authUserRepository.findByEmailOrFail(body.email);

    this.checkEmailConfirmedOrFail(user.emailConfirmed);
    await this.checkComparePasswordsOrFail(body.password, user.password as any);

    const accessToken = this.jwtService.sign({ sub: user.id, role: user.role });
    return new SignInResponseBodyDTO({ user, accessToken });
  }

  private checkEmailConfirmedOrFail(emailConfirmed: boolean): void {
    if (!emailConfirmed) {
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
