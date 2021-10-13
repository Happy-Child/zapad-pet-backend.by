import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT, RSA } from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { readFile } from '@app/helpers';
import { COOKIE } from '../constants';
import { AuthSignInService } from '../services';
import { IAuthJWTTokenPayload } from '../interfaces';
import { UsersRepository } from '../../users/repositories';
import { getJWTPayloadByMember } from '../helpers';
import { SimpleUserJWTPayloadDTO } from '../dtos';
import { TMemberJWTPayloadDTO } from '../types';
import { isMember } from '../../users/helpers';
import { TFullMemberDTO } from '../../users/types';

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
    payload: IAuthJWTTokenPayload,
  ): Promise<TMemberJWTPayloadDTO | SimpleUserJWTPayloadDTO> {
    const user = await this.usersRepository.getFullUserOrFail({
      id: payload.sub,
    });

    AuthSignInService.checkEmailConfirmedOrFail(user.emailConfirmed);

    if (isMember(user)) {
      AuthSignInService.isFullMemberOrFail(user);
      return getJWTPayloadByMember(user as TFullMemberDTO);
    } else {
      return {
        userId: user.id,
        role: user.role,
      };
    }
  }
}
