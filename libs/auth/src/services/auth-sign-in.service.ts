import { Injectable } from '@nestjs/common';
import {
  SignInRequestBodyDTO,
  SignInResponseBodyDTO,
  AuthUserRepository,
  comparePasswords,
  AUTH_ERRORS,
} from '@app/auth';
import { UnprocessableEntity } from '@app/exceptions';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthSignInService {
  constructor(
    private readonly authUserRepository: AuthUserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: SignInRequestBodyDTO): Promise<SignInResponseBodyDTO> {
    const user = await this.authUserRepository.findByEmailOrFail(body.email);
    if (!user.emailConfirmed) {
      throw new UnprocessableEntity([
        { field: 'email', message: AUTH_ERRORS.EMAIL_NOT_CONFIRMED },
      ]);
    }

    const passwordIsCompare = await comparePasswords(
      body.password,
      user.password,
    );
    if (!passwordIsCompare) {
      throw new UnprocessableEntity([
        { field: 'password', message: AUTH_ERRORS.INVALID_PASSWORD },
      ]);
    }

    const accessToken = this.jwtService.sign({ sub: user.id, role: user.role });

    return new SignInResponseBodyDTO({ user, accessToken });
  }
}
