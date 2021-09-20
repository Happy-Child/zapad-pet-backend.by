import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from '@app/auth/helpers';
import { AuthUserRepository } from '@app/auth/repositories';
import { SignInRequestBodyDTO, SignInResponseBodyDTO } from '@app/auth/dtos';
import { ExceptionsUnprocessableEntity } from '@app/exceptions/errors';
import { AUTH_ERRORS } from '@app/auth/constants';

@Injectable()
export class AuthSignInService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: SignInRequestBodyDTO): Promise<SignInResponseBodyDTO> {
    const user = await this.authUserRepository.findByEmailOrFail(body.email);
    if (!user.emailConfirmed) {
      throw new ExceptionsUnprocessableEntity([
        { field: 'email', messages: [AUTH_ERRORS.EMAIL_NOT_CONFIRMED] },
      ]);
    }

    const passwordIsCompare = await comparePasswords(
      body.password,
      user.password,
    );
    if (!passwordIsCompare) {
      throw new ExceptionsUnprocessableEntity([
        { field: 'password', messages: [AUTH_ERRORS.INVALID_PASSWORD] },
      ]);
    }

    const accessToken = this.jwtService.sign({ sub: user.id, role: user.role });

    return new SignInResponseBodyDTO({ user, accessToken });
  }
}
