import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { JWT, RSA } from 'config';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { readFile } from '@app/helpers';
import { COOKIE } from '../constants';
import { AuthGeneralService, AuthSignInService } from '../services';
import { IAuthJWTTokenPayload } from '../interfaces';
import { getJwtPayloadByMember } from '../helpers';
import { SimpleUserJWTPayloadDTO } from '../dtos';
import { TMemberJWTPayloadDTO } from '../types';
import { TFullMemberDTO, TUserDTO } from '../../users/types';
import { EntityFinderGeneralService } from '../../entity-finder/services';
import { isMember } from '../../users/helpers';

@Injectable()
export class AuthJwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly entityFinderGeneralService: EntityFinderGeneralService,
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

  public async validate(
    payload: IAuthJWTTokenPayload,
  ): Promise<TMemberJWTPayloadDTO | SimpleUserJWTPayloadDTO> {
    const user = await this.entityFinderGeneralService.getFullUserOrFail({
      id: payload.sub,
    });

    return this.getFinalPayloadOrFail(user);
  }

  private getFinalPayloadOrFail(
    user: TUserDTO,
  ): TMemberJWTPayloadDTO | SimpleUserJWTPayloadDTO {
    AuthSignInService.checkEmailConfirmedOrFail(user.emailConfirmed);

    if (isMember(user)) {
      AuthGeneralService.isFullMemberOrFail(user);
      return getJwtPayloadByMember(user as TFullMemberDTO);
    } else {
      return {
        userId: user.id,
        role: user.role,
      };
    }
  }
}
