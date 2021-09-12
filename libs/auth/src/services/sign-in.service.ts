import { Injectable } from '@nestjs/common';
import {
  SignInRequestBodyDTO,
  SignInResponseBodyDTO,
} from '@app/auth/dtos/sign-in.dtos';
import { UserRepository } from '@app/auth/repositories/user.repository';
import { UnprocessableEntity } from '@app/exceptions';
import { AUTH_ERRORS } from '@app/constants';
import { comparePasswords } from '@app/auth/helpers/password.helpers';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class SignInService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(body: SignInRequestBodyDTO): Promise<SignInResponseBodyDTO> {
    const user = await this.userRepository.findByEmailOrFail(body.email);
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
