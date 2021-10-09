import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT, RSA } from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { readFile } from '@app/helpers';
import { COOKIE } from '../constants';
import { AuthSignInService } from '../services';
import { GeneralJWTPayload } from '../types';
import { UsersRepository } from '../../users/repositories';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req) => {
          if (req) {
            if (req.cookies && req.cookies[COOKIE.ACCESS_TOKEN]) {
              return req.cookies[COOKIE.ACCESS_TOKEN];
            }

            const tokenHeaderRaw = req.header(COOKIE.ACCESS_TOKEN);
            if (tokenHeaderRaw) {
              return tokenHeaderRaw.replace('Bearer ', '');
            }
          }

          return null;
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: readFile(RSA.PUBLIC_KEY_PATH),
      algorithms: [JWT.ALGORITHM],
    });
  }

  public async validate(
    payload: Partial<GeneralJWTPayload>,
  ): Promise<GeneralJWTPayload> {
    const member = await this.usersRepository.getMemberOrFail({
      id: payload.sub,
    });

    AuthSignInService.checkEmailConfirmedOrFail(member.emailConfirmed);

    // HOW CHECK ACTUAL DATA?

    return payload as any;
  }
}
