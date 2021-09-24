import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT, RSA } from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { readFile } from '@app/helpers';
import { ExceptionsUnauthorized } from '@app/exceptions/errors';
import { AuthUserRepository } from '../repositories';
import { COOKIE } from '../constants';
import { IAuthJwtPayload } from '../interfaces';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(private readonly userRepository: AuthUserRepository) {
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

  public async validate(payload: any): Promise<IAuthJwtPayload> {
    await this.userRepository.getOneOrFail(
      { id: payload?.sub },
      {
        exception: {
          type: ExceptionsUnauthorized,
        },
      },
    );

    return {
      id: payload.sub,
      role: payload.role,
    };
  }
}
