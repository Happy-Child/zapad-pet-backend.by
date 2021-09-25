import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT, RSA } from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { readFile } from '@app/helpers';
import { ExceptionsUnauthorized } from '@app/exceptions/errors';
import { AuthUserRepository } from '../repositories';
import { AUTH_ERRORS, COOKIE } from '../constants';
import { IAuthJwtPayload } from '../interfaces';
import { AuthSignInService } from '../services';
import { ENTITIES_FIELDS } from '@app/entities';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly userRepository: AuthUserRepository,
    private readonly authSignInService: AuthSignInService,
  ) {
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
    const user = await this.userRepository.getOneOrFail(
      { id: payload?.sub },
      {
        exception: {
          type: ExceptionsUnauthorized,
          messages: [
            {
              field: ENTITIES_FIELDS.UNKNOWN,
              messages: [AUTH_ERRORS.UNAUTHORIZED],
            },
          ],
        },
      },
    );

    await this.authSignInService.isCompleteUserRoleOrFail(user);

    return {
      id: payload.sub,
      role: payload.role,
    };
  }
}
